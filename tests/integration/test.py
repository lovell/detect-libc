#!/usr/bin/env python2

import os
import json
import argparse
import subprocess
import threading
import sys
import tempfile
from prettytable import PrettyTable

# helper for progress output
class RepeatingTimer(threading._Timer):
    def run(self):
        while True:
            self.finished.wait(self.interval)
            if self.finished.is_set():
                return
            else:
                self.function(*self.args, **self.kwargs)

def print_progress():
    def output():
        sys.stdout.write('.')
        sys.stdout.flush()
    sys.stdout.write('Waiting...')
    sys.stdout.flush()
    progress = RepeatingTimer(5.0, output)
    progress.daemon = True
    progress.start()
    def cancel():
        progress.cancel()
        print '. done!'
    return cancel

def execute_command(args, printwait=True, printout=True, raiseerr=True):
    # begin printing of progress
    stop_print_progress = lambda: None
    if printwait:
        stop_print_progress = print_progress()
    # ecexute command while collecting output
    with tempfile.TemporaryFile() as output:
        exitcode = subprocess.call(args, stdout=output, stderr=output)
        # stop printing of progress
        stop_print_progress()
        # collect process output
        output.seek(0)
        output_string = output.read()
        # print process output
        if printout:
            print output_string.strip()
        # raise exception of process failed
        if raiseerr and exitcode != 0:
            raise Exception('command execution failed', exitcode, args, output_string)
        # return output to caller
        return exitcode, output_string

# sort helper
def multikeysort(items, columns):
    from operator import itemgetter
    comparers = [((itemgetter(col[1:].strip()), -1) if col.startswith('-') else
                  (itemgetter(col.strip()), 1)) for col in columns]
    def comparer(left, right):
        for fn, mult in comparers:
            result = cmp(fn(left), fn(right))
            if result:
                return mult * result
        else:
            return 0
    return sorted(items, cmp=comparer)

# get script directory
scriptdir = os.path.dirname(__file__)
projectdir = os.path.abspath(os.path.join(scriptdir, '..', '..'))

# load configuration
config = None
with open(os.path.join(scriptdir, 'config.json')) as config_file:
    config = json.load(config_file)

# load specification
spec = None
with open(os.path.join(scriptdir, 'spec.json')) as spec_file:
    spec = json.load(spec_file)

# UTIL: list all defined matrics
def list_matrices():
    return spec.keys()

# UTIL: get matrix (exploded)
def get_matrix(matrix):
    data = spec[matrix]
    matrix_dec = matrix.split(':', 2)
    result = []
    for distver in data['dist']:
        for nodever in data['node']:
            item = {
                'matrix': matrix,
                'dist.code': matrix_dec[0],
                'dist.version': distver,
                'node.version': nodever,
                'expected': { }
            }
            def extract_vars(conf):
                for varkey in conf:
                    if varkey.startswith('$'):
                        item['expected'][varkey[1:]] = conf[varkey]
            extract_vars(data)
            extract_vars(data['dist'][distver])
            extract_vars(data['node'][nodever])
            result.append(item)
    return multikeysort(result, ['dist.code', 'dist.version', 'node.version'])

# UTIL: get matrices (exploded)
def get_matrices(matrices):
    result = []
    for matrix in matrices:
        result += get_matrix(matrix)
    return multikeysort(result, ['dist.code', 'dist.version', 'node.version'])

# UTIL: find corresponding dockerfile
def get_dockerfile(distname, distver, nodever):
    dockerfile = distname + '-' + distver + '-' + 'nodejs' + '-' + nodever + '.dockerfile'
    for rootdir, dirnames, filenames in os.walk(os.path.join(scriptdir, 'spec', distname)):
        for filename in filenames:
            if filename == dockerfile:
                return os.path.join(rootdir, filename)
    return None

# COMMAND: list all tags
def cmd_list(matrices):
    items = get_matrices(matrices)
    for item in items:
        tag = item['dist.code'] + '-' + item['dist.version'] + '-' + 'nodejs' + '-' + item['node.version']
        print(tag + ' (' + item['matrix'] + ')')

# COMMAND: build docker images
def cmd_build(matrices):
    items = get_matrices(matrices)
    failed = False
    for item in items:
        tag = item['dist.code'] + '-' + item['dist.version'] + '-' + 'nodejs' + '-' + item['node.version']
        print 'Building: ' + tag
        dockerfile = get_dockerfile(item['dist.code'], item['dist.version'], item['node.version'])
        if dockerfile is not None:
            exitcode, output = execute_command([
                    'docker', 'build', '--quiet',
                    '-t', config['registry'] + ':' + tag,
                    '-f', dockerfile,
                    os.path.join(scriptdir, 'spec', item['dist.code'])
                ], raiseerr=False)
            if exitcode != 0:
                failed = True
                print "... failed!"
        else:
            failed = True
            print "... dockerfile not found!"
    if failed:
        print "At least one item failed!"
        sys.exit(1)
    print 'All done!'

# COMMAND: push docker images
def cmd_push(matrices):
    items = get_matrices(matrices)
    failed = False
    for item in items:
        tag = item['dist.code'] + '-' + item['dist.version'] + '-' + 'nodejs' + '-' + item['node.version']
        print 'Pushing: ' + tag
        exitcode, output = execute_command([ 'docker', 'push', config['registry'] + ':' + tag ], raiseerr=False)
        if exitcode != 0:
            failed = True
            print "... failed!"
    if failed:
        print "At least one item failed!"
        sys.exit(1)
    print 'All done!'

# COMMAND: pull docker images
def cmd_pull(matrices):
    items = get_matrices(matrices)
    failed = False
    for item in items:
        tag = item['dist.code'] + '-' + item['dist.version'] + '-' + 'nodejs' + '-' + item['node.version']
        print 'Pulling: ' + tag
        exitcode, output = execute_command([ 'docker', 'pull', config['registry'] + ':' + tag ], raiseerr=False)
        if exitcode != 0:
            failed = True
            print "... failed!"
    if failed:
        print "At least one item failed!"
        sys.exit(1)
    print 'All done!'

# COMMAND: run integration tests
def cmd_run(matrices):
    # run tests
    items = get_matrices(matrices)
    for item in items:
        tag = item['dist.code'] + '-' + item['dist.version'] + '-' + 'nodejs' + '-' + item['node.version']
        print 'Testing: ' + tag
        # run test command
        exitcode, output = execute_command(
            [   'docker', 'run', '--rm',
                '-v', projectdir + ':/module',
                config['registry'] + ':' + tag,
                'sh', '-c', 'cd /module && node ./tests/integration/probe.js'
            ],
            printwait=False, raiseerr=False
        )
        # extract result
        item['actual'] = None
        if exitcode != 0:
            print "... test not executed!"
        else:
            for line in output.split('\n'):
                if line.startswith('result='):
                    try:
                        item['actual'] = json.loads(line[7:])
                        print "... result found!"
                    except ValueError:
                        print "... result not found!"
            print "... test executed!"
        # validate
        check_executed = item['actual'] is not None
        item['check'] = {
            'executed': check_executed,
            'summary': check_executed
        }
        for check in item['expected']:
            if check_executed and check in item['actual']:
                item['check'][check] = (item['expected'][check] == item['actual'][check])
            else:
                item['check'][check] = False
            if not item['check'][check]:
                item['check']['summary'] = False
                if check_executed and check in item['actual']:
                    print '... check "' + check + '" did not pass; expected "' + item['expected'][check] + '" vs. "' + item['actual'][check] + '"!'
                else:
                    print '... check "' + check + '" not executed; expected "' + item['expected'][check] + '"!'

    print 'All done!'
    # generate counts
    counts = { 'total': { }, 'ok': { }, 'failed': { } }
    for item in items:
        for check in item['check']:
            if check not in counts['total']:
                counts['total'][check] = 0
            if check not in counts['ok']:
                counts['ok'][check] = 0
            if check not in counts['failed']:
                counts['failed'][check] = 0
            counts['total'][check] += 1
            if item['check'][check]:
                counts['ok'][check] += 1
            else:
                counts['failed'][check] += 1
    # print result
    print "Result:"
    table = PrettyTable(['Configuration', 'Executed', 'Method', 'Family', 'Version', 'Node.js', 'Distribution', 'Summary'])
    table.align = 'l'
    for item in items:
        tag = item['dist.code'] + '-' + item['dist.version'] + '-' + 'nodejs' + '-' + item['node.version']
        table.add_row([
            tag,
            'OK' if item['check']['executed'] else 'FAILED',
            'OK' if item['check']['detect.method'] else 'FAILED',
            'OK' if item['check']['libc.family'] else 'FAILED',
            'OK' if item['check']['libc.version'] else 'FAILED',
            'OK' if item['check']['node.version'] else 'FAILED',
            'OK' if item['check']['dist.name'] else 'FAILED',
            'OK' if item['check']['summary'] else 'FAILED'
        ])
    print(table)
    # print counts
    table = PrettyTable(['Configuration', 'Executed', 'Method', 'Family', 'Version', 'Node.js', 'Distribution', 'Summary'])
    table.align = 'l'
    table.add_row([
        'TOTAL',
        counts['total']['executed'],
        counts['total']['detect.method'],
        counts['total']['libc.family'],
        counts['total']['libc.version'],
        counts['total']['node.version'],
        counts['total']['dist.name'],
        counts['total']['summary']
    ])
    table.add_row([
        'OK',
        counts['ok']['executed'],
        counts['ok']['detect.method'],
        counts['ok']['libc.family'],
        counts['ok']['libc.version'],
        counts['ok']['node.version'],
        counts['ok']['dist.name'],
        counts['ok']['summary']
    ])
    table.add_row([
        'FAILED',
        counts['failed']['executed'],
        counts['failed']['detect.method'],
        counts['failed']['libc.family'],
        counts['failed']['libc.version'],
        counts['failed']['node.version'],
        counts['failed']['dist.name'],
        counts['failed']['summary']
    ])
    print(table)
    # handle exit code
    if counts['failed']['summary'] > 0:
        sys.exit(1)

# run main routine
if __name__ == "__main__":
    # parse arguments
    parser = argparse.ArgumentParser(description='prepare and execute docker based integration tests.')
    parser.add_argument('command', choices=['list', 'build', 'push', 'pull', 'run'], help='command to be executed')
    parser.add_argument('matrix', nargs='*', help='matrix filter (default = all)')
    args = parser.parse_args()
    # validate selected matrices
    matrices = None
    if args.matrix is None or len(args.matrix) == 0:
        matrices = list_matrices()
    else:
        matrices = []
        for arg_matrix in args.matrix:
            for matrix in list_matrices():
                if arg_matrix == matrix or matrix.startswith(arg_matrix+':'):
                    matrices.append(matrix)
    # run command
    cmds = {
        'list': cmd_list,
        'build': cmd_build,
        'push': cmd_push,
        'pull': cmd_pull,
        'run': cmd_run
    }
    cmds[args.command](matrices)

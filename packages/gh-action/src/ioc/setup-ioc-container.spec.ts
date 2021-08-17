// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import 'reflect-metadata';

import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { Container } from 'inversify';
import { setupIocContainer } from './setup-ioc-container';
import { iocTypes } from '@accessibility-insights-action/shared';
import { GHTaskConfig } from '../task-config/gh-task-config';
import { PullRequestCommentCreator } from '../pull-request/pull-request-comment-creator';
import { CheckRunCreator } from '../check-run/check-run-creator';

describe(setupIocContainer, () => {
    let testSubject: Container;

    beforeEach(() => {
        testSubject = setupIocContainer();
    });

    test.each([Octokit])('verify singleton resolution %p', (key: any) => {
        verifySingletonDependencyResolution(testSubject, key);
    });
    test.each([
        { key: iocTypes.Github, value: github },
        { key: iocTypes.TaskConfig, value: GHTaskConfig },
        { key: iocTypes.ProgressReporters, value: [PullRequestCommentCreator, CheckRunCreator] },
    ])('verify constant value resolution %s', (pair: { key: string; value: any }) => {
        expect(testSubject.get(pair.key)).toEqual(pair.value);
    });

    function verifySingletonDependencyResolution(container: Container, key: any): void {
        expect(container.get(key)).toBeDefined();
        expect(container.get(key)).toBe(container.get(key));
    }
});
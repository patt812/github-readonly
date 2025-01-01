import { issueFeature } from './features/issue';
import { pullRequestFeature } from './features/pull_request';
import { registerFeature, initialize } from './utils/readonly';

// Initialize features
registerFeature(issueFeature);
registerFeature(pullRequestFeature);

initialize(); 
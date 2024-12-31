import { issueFeature } from './features/issue';
import { registerFeature, initialize } from './utils/readonly';

// Initialize features
registerFeature(issueFeature);

initialize(); 
import { bannerFeature } from './features/banner';
import { issueFeature } from './features/issue';
import { registerFeature, initialize } from './utils/readonly';

// Register features
registerFeature(bannerFeature);
registerFeature(issueFeature);

initialize(); 
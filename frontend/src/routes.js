import About from './About.jsx';
import Conversation from './Conversation.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/about', component: About },
  { path: '/', component: Conversation },
  { path: '/profile', component: NotFound },
];

export default routes;

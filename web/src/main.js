/*
* Import Vue
*/
import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

/*
* Import PrimeVue
*/
import Button from 'primevue/button';
import ConfirmationService from 'primevue/confirmationservice';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import PrimeVue from 'primevue/config';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

/*
* Import custom components
*/
import Modal from '@/components/Modal.vue';

/*
* Import styles
*/
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './assets/styles/vela-blue/theme.css';
import './assets/styles/vela-blue/override.less';
import './assets/styles/site.less';

/*
* Setup
*/
const app = createApp(App);
app.use(store);
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);

/*
* Register PrimeVue components
*/
app.component('Button', Button);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('Panel', Panel);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Toast', Toast);
app.directive('tooltip', Tooltip);

/*
* Register custom components
*/
app.component('Modal', Modal);

/*
* Let's go!
*/
app.mount('#app');

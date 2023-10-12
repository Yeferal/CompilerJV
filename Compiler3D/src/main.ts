import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import 'codemirror/mode/javascript/javascript';
// import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import './assets/myLenguage.js';
// import 'codemirror/mode/python/python';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

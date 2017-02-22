import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
/*
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);


if (environment.production) {
  enableProdMode();
}
const loader = document.getElementById( 'loader' );
loader.classList.remove('Hidden');
platformBrowserDynamic().bootstrapModule(AppModule).then(function(){

setTimeout(function(){
  loader.classList.add('Hidden');
 }, 300 );
});
*/
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
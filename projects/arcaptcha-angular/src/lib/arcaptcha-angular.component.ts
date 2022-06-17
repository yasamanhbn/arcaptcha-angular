import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

declare global {
  interface Window {
    arcaptchaWidgetLoading: any; // 👈️ turn off type checking
  }
}

@Component({
  selector: 'lib-arcaptcha-angular',
  template: '<div id={{id}} href="arcaptcha"></div>',
})

export class ArcaptchaAngularComponent implements OnInit {
  constructor() { }

  @Input() callback = function name() { };
  @Input() site_key = '';
  @Input() lang = 'fa';
  @Input() theme = 'light'
  @Input() invisible = false

  @Output() onsetChallengeId: EventEmitter<number> = new EventEmitter();

  id: string = ''
  widget_id: string = ''


  ngOnInit(): void {
    this.setID()
    var my_script = document.head.querySelector("#arcptcha-script") as HTMLImageElement | null;;
    const script = my_script || document.createElement("script") ;

    if (!my_script) {
      window.arcaptchaWidgetLoading = new Promise<void>((resolve, reject) => {
        script.src = `https://widget.arcaptcha.ir/1/api.js`;
        script.id = "arcptcha-script";
        script.onload = () => {
          resolve();
          this.initialize();
        };
      });
    }
    if (my_script) {
      window.arcaptchaWidgetLoading.then(() => {
        this.initialize();
      });
    }
    if (!my_script) {
      document.head.appendChild(script);
    }
  }

  initialize() {
    this.loadCaptcha();
    window.addEventListener('arcaptcha-token-changed-' + this.widget_id,
    event => { /* this.onsetChallengeId.emit((<any>event).detail)  */})
  }

  loadCaptcha() {
    if (this.callback)
      (window as { [key: string]: any })['arcaptcha_callback_' + this.id] = this.callback

    const widgetId = (window as any).arcaptcha.render('#' + this.id, {
      "site-key": this.site_key,
      lang: this.lang,
      theme: this.theme,
      size: this.invisible ? "invisible" : "",
      callback: this.invisible
        ? 'arcaptcha_callback_' + this.id
        : null,
    })
    this.widget_id = widgetId
  }

  getRandomID() {
    return (
      new Date().getTime().toString(36) +
      Math.random().toString(36).slice(2)
    );
  }

  setID() {
    this.id = 'arcaptcha-widget-' + this.getRandomID()
  }

  resetCaptcha() {
    (window as any).arcaptcha.reset(this.widget_id);
  }

  execute() {
    (window as any).arcaptcha.execute(this.widget_id);
  }

}


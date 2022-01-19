import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

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
    const script = document.createElement("script");
    script.src = `https://widget.arcaptcha.ir/1/api.js`;
    script.onload = () => {
      this.loadCaptcha();
      window.addEventListener('arcaptcha-token-changed-' + this.widget_id,
        event => { this.onsetChallengeId.emit((<any>event).detail) })
    }
    document.body.appendChild(script);
  }


  loadCaptcha() {
    console.log(this.callback)
    if (this.callback)
      (window as { [key: string]: any })['arcaptcha_callback_' + this.id] = this.callback

    const widgetId = window.arcaptcha.render('#' + this.id, {
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
    window.arcaptcha.reset(this.widget_id);
  }

  execute() {
    window.arcaptcha.execute(this.widget_id);
  }

}


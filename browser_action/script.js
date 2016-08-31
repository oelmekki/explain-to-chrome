class Main {
  constructor(){
    this.useOnDomain = false;
    this.domain = '';
    document.querySelector( 'button' ).addEventListener( 'click', this.toggle.bind( this ) );
    this.check();
  }

  check(){
    chrome.runtime.getBackgroundPage( ( background ) => {
      background.retrieveDomain().then( ( domain ) => {
        document.querySelector( "#domain" ).innerText = domain;
        this.domain = domain;

        background.useOnDomain( domain ).then( ( useIt ) => {
          this.useOnDomain = useIt;

          document.querySelector( '#status' ).innerText = useIt ? "summarizing links" : "not summarizing links";
          document.querySelector( 'button' ).innerText = useIt ? "Suspend" : "Activate";
        });
      });
    });
  }

  toggle(){
    chrome.runtime.getBackgroundPage( ( background ) => {
      background.toggleUse( this.domain, ! this.useOnDomain ).then( this.check.bind( this ) );
    });
  }
}

document.addEventListener( "DOMContentLoaded", () => new Main() );

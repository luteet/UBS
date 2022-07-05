(function () {
  var FX = {
      easing: {
          linear: function (progress) {
              return progress;
          },
          quadratic: function (progress) {
              return Math.pow(progress, 2);
          },
          swing: function (progress) {
              return 0.5 - Math.cos(progress * Math.PI) / 2;
          },
          circ: function (progress) {
              return 1 - Math.sin(Math.acos(progress));
          },
          back: function (progress, x) {
              return Math.pow(progress, 2) * ((x + 1) * progress - x);
          },
          bounce: function (progress) {
              for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                  if (progress >= (7 - 4 * a) / 11) {
                      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                  }
              }
          },
          elastic: function (progress, x) {
              return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
          }
      },
      animate: function (options) {
          var start = new Date;
          var id = setInterval(function () {
              var timePassed = new Date - start;
              var progress = timePassed / options.duration;
              if (progress > 1) {
                  progress = 1;
              }
              options.progress = progress;
              var delta = options.delta(progress);
              options.step(delta);
              if (progress == 1) {
                  clearInterval(id);
  
                  options.complete();
              }
          }, options.delay || 10);
      },
      fadeOut: function (element, options) {
          var to = 1;
          this.animate({
              duration: options.duration,
              delta: function (progress) {
                  progress = this.progress;
                  return FX.easing.swing(progress);
              },
              complete: options.complete,
              step: function (delta) {
                  element.style.opacity = to - delta;
              }
          });
      },
      fadeIn: function (element, options) {
          var to = 0;
          element.style.display = 'block';
          this.animate({
              duration: options.duration,
              delta: function (progress) {
                  progress = this.progress;
                  return FX.easing.swing(progress);
              },
              complete: options.complete,
              step: function (delta) {
                  element.style.opacity = to + delta;
              }
          });
      }
  };
  window.FX = FX;
})()


const body = document.querySelector('body'),
    html = document.querySelector('html'),
    menu = document.querySelectorAll('._burger, .header__nav, .header-admin__nav, body'),
    burger = document.querySelector('._burger'),
    header = document.querySelector('.header');

// =-=-=-=-=-=-=-=-=-=-=-=- <popup> -=-=-=-=-=-=-=-=-=-=-=-=
    
let popupCheck = true, popupCheckClose = true;
function popup(arg) {

if (popupCheck) {
    popupCheck = false;

    let popup, popupClose,

        body = arg.body,
        html = arg.html,
        header = arg.header,
        duration = (arg.duration) ? arg.duration : 200,
        id = arg.id;

    try {

        popup = document.querySelector(id);
        popupClose = popup.querySelectorAll('._popup-close');

    } catch {
        return false;
    }

    function removeFunc(popup, removeClass) {

        if (popupCheckClose) {
            popupCheckClose = false;


            FX.fadeOut(popup, {
                duration: duration,
                complete: function () {
                    popup.style.display = 'none';
                    
                }
            });
            popup.classList.remove('_active');

            setTimeout(() => {
                popupCheckClose = true;
            }, duration)

            if (removeClass) {
                if (header) header.classList.remove('_popup-active');

                setTimeout(function () {

                    body.classList.remove('_popup-active');
                    html.style.setProperty('--popup-padding', '0px');
                    arg.close();

                }, duration)
            }
        }
    }

    body.classList.remove('_popup-active');
    html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
    body.classList.add('_popup-active');

    popup.classList.add('_active');
    if (header) header.classList.add('_popup-active');


    setTimeout(function () {
        FX.fadeIn(popup, {
            duration: duration,
            complete: function () {
            }
        });
    }, duration);



    popupClose.forEach(element => {
        element.addEventListener('click', function () {
            if (document.querySelectorAll('._popup._active').length <= 1) {
                removeFunc(popup, true);
            } else {
                removeFunc(popup, false);
            }
            setTimeout(function () {
                return false;
            }, duration)
        });
    })


    setTimeout(() => {
        popupCheck = true;
    }, duration);

}

}

// =-=-=-=-=-=-=-=-=-=-=-=- </popup> -=-=-=-=-=-=-=-=-=-=-=-=

let thisTarget;
body.addEventListener('click', function (event) {

    thisTarget = event.target;

    // Меню в шапке
    if (thisTarget.closest('._burger')) {
        menu.forEach(elem => {
            elem.classList.toggle('_active')
        })
    }



    let btnPopup = thisTarget.closest('._open-popup');
    if(btnPopup) {
      event.preventDefault();
      btnPopup.classList.add('_active');
      popup({
        id: btnPopup.getAttribute('href'),
        close: function() {
          btnPopup.classList.remove('_active');
        },
        html: html,
        body: body,
      });
    
    }



    let applicationsItemBtn = thisTarget.closest('.applications__item--btn');
    if(applicationsItemBtn) {
      applicationsItemBtn.closest('.applications__table--wrapper').classList.toggle('_active');
    } else {
        if(document.querySelector('.applications__table--wrapper')) document.querySelector('.applications__table--wrapper').classList.remove('_active');
    }



    let applicationsItem = thisTarget.closest('.applications__item');
    if(applicationsItem) {
      applicationsItem.classList.toggle('_active');
    } else {
      document.querySelectorAll('.applications__item').forEach(thisElement => {
        thisElement.classList.remove('_active');
      })
    }



    let videoPreview = thisTarget.closest('._video-preview');
    if(videoPreview) {
        let parent = videoPreview.closest('._video-block'),
            video = (parent) ? parent.querySelector('._video-element') : false;
        
        if(video) {
            videoPreview.classList.add('_hidden');
            setTimeout(() => {
                video.play();
            },0)
        }

    }



    let inputSelectCurrent = thisTarget.closest('.input-select__current');
    if(inputSelectCurrent) {
        
        let parent  = inputSelectCurrent.parentElement;

        if(parent.classList.contains('_active')) {
            document.querySelectorAll('.input-select__body._active').forEach(thisInputSelect => {
                thisInputSelect.classList.remove('_active');
            })

            parent.classList.remove('_active');
        } else {
            document.querySelectorAll('.input-select__body._active').forEach(thisInputSelect => {
                thisInputSelect.classList.remove('_active');
            })

            parent.classList.add('_active');
        }
        

        

    }



    let inputSelectOption = thisTarget.closest('.input-select__option');
    if(inputSelectOption) {
        let parent  = inputSelectOption.closest('.input-select__body'),
            current = parent.querySelector('.input-select__current');

        parent.classList.remove('_active');
        current.innerHTML = `<img src="${inputSelectOption.querySelector('.input-select__img').getAttribute('src')}" width="16" height="16" alt="" class="input-select__img">`

        if(inputSelectOption.dataset.inputValue) {
            inputSelectOption.closest('.input-select').parentElement.querySelector('input').value = inputSelectOption.dataset.inputValue;
        }

    } else if(!thisTarget.closest('.input-select')) {
        document.querySelectorAll('.input-select__body._active').forEach(thisInputSelect => {
            thisInputSelect.classList.remove('_active');
        })
    }

})

document.querySelectorAll('.input-select__current').forEach(thisInputCurrent => {

    if(thisInputCurrent.dataset.inputValue) {
        thisInputCurrent.closest('.input-select').parentElement.querySelector('input').value = thisInputCurrent.dataset.inputValue;
    }

})

function customeDate() {

  new AirDatepicker('._custome-date', {
    dateFormat: 'dd/MM/yyyy'
  })

   
}

customeDate();


// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=
/*
let slider = new Swiper('.__slider', {
  
    spaceBetween: 30,
    slidesPerView: 1,
    centeredSlides: false,

    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      992: {
        slidesPerView: 3,
        centeredSlides: true,
    
      },
      600: {
        slidesPerView: 2,
        centeredSlides: false,
      },
    }
}); 
*/
// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=


/* 
// =-=-=-=-=-=-=-=-=-=-=-=- <Анимации> -=-=-=-=-=-=-=-=-=-=-=-=

wow = new WOW({
mobile:       false,
})
wow.init();

// =-=-=-=-=-=-=-=-=-=-=-=- </Анимации> -=-=-=-=-=-=-=-=-=-=-=-=

*/

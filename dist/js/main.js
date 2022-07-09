
function copyToClipboard(el) {
    
    // resolve the element
    el = (typeof el === 'string') ? document.querySelector(el) : el;
  
    // handle iOS as a special case
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
  
      // save current contentEditable/readOnly status
      var editable = el.contentEditable;
      var readOnly = el.readOnly;
  
      // convert to editable with readonly to stop iOS keyboard opening
      el.contentEditable = true;
      el.readOnly = true;
  
      // create a selectable range
      var range = document.createRange();
      range.selectNodeContents(el);
  
      // select the range
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      el.setSelectionRange(0, 999999);
  
      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
    }
    else {
      navigator.clipboard.writeText(el.value)
        .then(() => {
            
        })
        .catch(err => {
          console.log('Something went wrong', err);
        });
      //el.select();
      el.remove();
    }
  
    // execute copy command
    document.execCommand('copy');
}

function iosCopyToClipboard(el) {
    var oldContentEditable = el.contentEditable,
        oldReadOnly = el.readOnly,
        range = document.createRange();

    el.contentEditable = true;
    el.readOnly = false;
    range.selectNodeContents(el);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

    el.contentEditable = oldContentEditable;
    el.readOnly = oldReadOnly;

    document.execCommand('copy');
}

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

const player = new Plyr('#player', {
    muted: true,
});

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

let thisTarget, applicationsItemBtnCheck = true;
body.addEventListener('click', function (event) {

    thisTarget = event.target;

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



    let applicationsItem = thisTarget.closest('.applications__item');
    if(applicationsItem) {
      applicationsItem.classList.toggle('_active');
    } else if(!applicationsItem && !thisTarget.closest('.applications__item--btn') && !thisTarget.closest('._copy-btn')) {
      document.querySelectorAll('.applications__item').forEach(thisElement => {
        thisElement.classList.remove('_active');
      })
    }



    let applicationsItemBtn = thisTarget.closest('.applications__item--btn');
    if(applicationsItemBtn) {

        if(applicationsItemBtn.classList.contains('active')) {

            applicationsItemBtn.classList.remove('active');
            applicationsItemBtn.closest('.applications__table--wrapper').querySelectorAll('.applications__item').forEach(thisElement => {
                thisElement.classList.remove('_active');
            })

        } else {

            applicationsItemBtn.classList.add('active');
            applicationsItemBtn.closest('.applications__table--wrapper').querySelectorAll('.applications__item').forEach(thisElement => {
                thisElement.classList.add('_active');
            })

        }
        

    } else if(!applicationsItemBtn && !thisTarget.closest('.applications__item') && !thisTarget.closest('._copy-btn')) {
        document.querySelectorAll('.applications__item').forEach(thisElement => {
            thisElement.classList.remove('_active');
        })

        document.querySelectorAll('.applications__item--btn').forEach(thisElement => {
            thisElement.classList.remove('active');
        })
    }



    let copyBtn = thisTarget.closest('._copy-btn');
    if(copyBtn) {
        event.preventDefault();

        let copyInputs = document.querySelectorAll('.applications__item._active._visible .applications__item--data'),
        copyInput = document.createElement('input');
        
        copyInputs.forEach(thisInput => {
            copyInput.value += thisInput.value + '. ';
        })
        
        copyInput.value = copyInput.value.substring(0, copyInput.value.length - 1);

        document.body.append(copyInput);

        if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
            console.log('copy')
            iosCopyToClipboard(copyInput)
        } else {
            copyInput.select();
            document.execCommand("copy");
        }

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

    function select(argtDate) {
        let date = argtDate;

        document.querySelectorAll(`.applications__item`).forEach(thisElement => {
            if(thisElement.dataset.date == date) {
                setTimeout(() => {
                    thisElement.style.display = 'block';
                },200)
                setTimeout(() => {
                    thisElement.classList.add('_visible');
                },400)
                
            } else {
                thisElement.classList.remove('_visible');
                setTimeout(() => {
                    thisElement.style.display = 'none';
                },200)
            }
            
        })
    }

  document.querySelectorAll('._custome-date').forEach(thisCustomeDate => {
    let date = new Date(),
    day = (date.getDate() <= 9) ? '0' + date.getDate() : date.getDate(),
    month = (date.getMonth() + 1 <= 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    
    thisCustomeDate.value = day + '/' + month + '/' + date.getFullYear();
    
    select(day + '/' + month + '/' + date.getFullYear());
  })

  new AirDatepicker('._custome-date', {
    dateFormat: 'dd/MM/yyyy',
    onSelect: function(arg) {
        select(arg.formattedDate);
    }
  })
   
}

customeDate();

function getCoords(elem) {
    let box = elem.getBoundingClientRect();
  
    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
}

const offsetCheck = document.querySelector('.offset-check-js');

function scrollFunc() {
    const videoBlock = document.querySelector('._video-block');

    if(videoBlock) {
        let top = getCoords(offsetCheck).top,
            topPage = getCoords(videoBlock).top,
            windowHeight = window.innerHeight;

        if((top + (windowHeight / 3)) > topPage && !videoBlock.classList.contains('_active')) {
            videoBlock.classList.add('_active');

            let video = videoBlock.querySelector('._video-element'),
                preview = videoBlock.querySelector('._video-preview');
            
            if(video) {
                preview.classList.add('_hidden');
                setTimeout(() => {
                    video.play();
                },0)
            }
        }
    }

    

}

window.onscroll = scrollFunc;


import avatarFrame from '../assets/img/avatar-frame.png'

export const defaultMarker = (info) => {
  return `<span class="marker">
            <span class="avatar_pic" style="
              --bg: url(/img/${info.alumnisrc});
              --size:${info['scale'] || 'cover'};
              --x:calc(50% - ${info['offset-x'] || '0'});
              --y:calc(50% - ${info['offset-y'] || '0'});"></span>
            <img class="frame" src='${avatarFrame}'/>
          </span>`;
}

export const activeMarker = (info) => {
  return `<span class="marker play_drop">
            <span class="avatar_pic" style="
              --bg: url(/img/${info.alumnisrc});
              --size:${info['scale'] || 'cover'};
              --x:calc(50% - ${info['offset-x'] || '0'});
              --y:calc(50% - ${info['offset-y'] || '0'});"></span>
            <img class="frame" src='${avatarFrame}'/>
          </span>`;
}

export const defaultLabel = (info, level) => {
  let content;
  switch (level) {
    case 1:
      content = `<div class='alumni-info normal' data-content='${info.name}'>${info.name}</div>`;
      break;
    case 2:
      content = `<div class='alumni-info normal' data-content='${info.name}'>${info.name}</div>
                 <div class='alumni-info normal' data-content='${info.phone}'>${info.phone}</div>`;
      break;

    case 3:
      content = `<div class='alumni-info normal' data-content='${info.name}'>${info.name}</div>
                 <div class='alumni-info normal' data-content='${info.phone}'>${info.phone}</div>
                 <div class='alumni-info normal' data-content='${info.signature}'>${info.signature}</div>`;
      break;

  }

  return {
    direction: 'right',
    content: content,
  };
}

export const activeLabel = (info, level) => {
  let content;
  switch (level) {
    case 1:
      content = `<div class='alumni-info active' data-content='${info.name}'>${info.name}</div>`;
      break;
    case 2:
      content = `<div class='alumni-info active' data-content='${info.name}'>${info.name}</div>
                 <div class='alumni-info active' data-content='${info.phone}'>${info.phone}</div>`;
      break;

    case 3:
      content = `<div class='alumni-info active' data-content='${info.name}'>${info.name}</div>
                 <div class='alumni-info active' data-content='${info.phone}'>${info.phone}</div>
                 <div class='alumni-info active' data-content='${info.signature}'>${info.signature}</div>`;
      break;

  }

  return {
    direction: 'bottom',
    content: content,
  };
}
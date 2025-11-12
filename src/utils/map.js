import avatarFrame from '../assets/img/avatar-frame.png'

export const defaultMarker = (info) => {
  return `<span class="marker">
            <img class="avatar" src='/img/${info.alumnisrc}'/>
            <img class="frame" src='${avatarFrame}'/>
          </span>`;
}

export const activeMarker = (info) => {
  return `<span class="marker play_drop">
            <img class="avatar" src='/img/${info.alumnisrc}'/>
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
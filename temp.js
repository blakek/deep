const { has, get, getOr, remove, set } = require('.');

const user = {
  profile: {
    bgColor: '#639'
  }
};

set('tomato', 'profile.bgColor', user);
set('/images/user.png', 'profile.bgImage', user);

const logout = set(null, 'profile');
console.log(logout(user)); //» { profile: null }

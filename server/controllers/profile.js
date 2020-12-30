var Profile_Service = require('../services/profile');
var fs = require('fs');
var path = require('path');
// var sharp = require('sharp')
var unique_string = require('unique-string');
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dvf4q79ri',
  api_key: '146796768431552',
  api_secret: 'KdHbnkAxtAC-sfjhnqGg8MCIT_Q'
});

exports.get_profile = async function (id) {
  var user = await Profile_Service.get_profile(id);
  if (user) {
    var profile = {
      username: user.data.username,
      email: user.data.email,
      password: '**********',
      avatar: user.data.avatar
    }
    return profile;
  } else {
    return null;
  }
}

exports.change_email = async function (id, new_email) {
  if (new_email.length > 0) {
    var valid = await Profile_Service.change_email(id, new_email);
    if (valid.type == 'valid') {
      return { alert: 'Email Successfully Changed' }
    } else {
      return { err: 'Sorry. Server Error' }
    }
  } else {
    return { err: 'Must provide username' }
  }
}

exports.password_correct = async function (user_id, password) {
  return await Profile_Service.password_correct(user_id, password);
}

exports.change_password = async function (id, current_password, new_password, new_password_confirm) {
  if (current_password.length > 0 || new_password.length > 0 || new_password_confirm.length > 0) {

    if (new_password == new_password_confirm) {
      var valid = await Profile_Service.change_password(id, current_password, new_password);
      if (valid.type == 'valid') {
        return { redirect: '/login' }
      } else {
        return { err: valid.data }
      }
    } else {
      return { err: 'The new passwords must match' }
    }

  } else {
    return { err: 'All fields must be filled' }
  }
}

exports.change_avatar = async function (file, crop_box, user_id) {
  // var rand_id = unique_string();
  // var extension = path.extname(file.name);
  // var target_filename = `${rand_id}${extension}`;

  // if (!fs.existsSync('./tmp_for_images')) {
  //   fs.mkdirSync('./tmp_for_images');
  // }

  // var target_filepath = `./tmp_for_images/${target_filename}`;

  // var avatar_path = await new Promise((resolve, reject) => {
  //   sharp(file.data)
  //     .extract({ left: crop_box.x, top: crop_box.y, width: crop_box.width, height: crop_box.height })
  //     .resize({ width: 100 })
  //     .toFile(target_filepath, function (err) {
  //       cloudinary.uploader.upload(target_filepath, function (result) {
  //         fs.unlink(target_filepath, function (err) { });
  //         resolve(result.secure_url);
  //       })
  //     })
  // });

  // return await Profile_Service.change_avatar(user_id, avatar_path);
}


// exports.change_avatar = async function(id, files) {
//   var files = Object.values(files);

//   if (files.length > 0) {

//     var file = files[0];

//     var image_pattern = new RegExp(/(png|jpg|jpeg|tiff|gif|bmp)/)

//     if (image_pattern.test(file.mimetype)) {

//       var target_file_extension = path.extname(file.name);
//       var target_file_name = String(unique_string()) + target_file_extension;
//       var target_path = path.join(__dirname, '../system_data/userdata/avatars', target_file_name);
//       try {
//         var user = await this.get_profile(id);
//         var current_file_name = user.avatar;
//       } catch (e) { console.log(e) }

//       var is_default = path.parse(current_file_name).base == 'default.png';

//       if (!is_default) {
//         var current_file_path = path.join(__dirname, '..', current_file_name);
//         fs.unlink(current_file_path, function(err) {
//           if (err) { console.log(err) }
//         })
//       }

//       var file_write_promise = new Promise(function(resolve, reject) {
//         fs.writeFile(target_path, file.data, function(err) {
//           if (err) { reject(err) }
//           resolve();
//         });
//       });

//       var db_change_promise = Profile_Service.change_avatar(id, target_file_name);

//       var valid = await Promise.all([
//         file_write_promise, 
//         db_change_promise])

//       if (valid[1].type == 'valid') {
//         return { alert: 'Avatar Successfully Changed' }
//       } else {
//         return { err: valid[1].data }
//       }

//     } else {
//       return { err: 'Must be an image file' }
//     }

//   } else {
//     return { err: 'Must Select an image' }
//   }
// }
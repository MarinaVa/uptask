const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const {emailToken} = require('../config/email');
const {MailtrapTransport} = require("mailtrap");
const Nodemailer = require("nodemailer");
const axios = require("axios");

const SENDER_EMAIL = "markiza.freelance@gmail.com";
const RECIPIENT_EMAIL = "markiza.freelance@gmail.com";

module.exports.enviarEmail = function(options) {
  return axios.get(`https://api.elasticemail.com/v2/email/send`, {
    params: {
      apikey: emailToken,
      to: options.to,
      from: 'markiza.freelance@gmail.com',
      subject: options.subject,
      bodyHtml: juice(pug.renderFile(`${__dirname}/../views/emails/${options.file}.pug`, options))
    }})
  .then(res => console.log((res)));
}
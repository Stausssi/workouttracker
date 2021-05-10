const {BACKEND_URL} = require("../misc");

//Secret for JWT Generation
exports.confirmSecret = "A8KedSV6AUNIbmj06lDUic2P3s7PZJrywGbuu5uzMDgXexdEHwzG1GjJjXXj9BRprq7JSjr1uNBWmUE7keRSuE5FYj6o9UMfijRu7wwX9NAjAY2";

//login credentials for gmail mailer
exports.auth = {
    user: 'workouttracker.dhbw@gmail.com',
    pass: 'lfSu5hEAsa60LCF7Y643'
};

// made with: https://beefree.io/

exports.emailContent = (user) => {
    return ("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
        "\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:v=\"urn:schemas-microsoft-com:vml\">\n" +
        "<head>\n" +
        "<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->\n" +
        "<meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\"/>\n" +
        "<meta content=\"width=device-width\" name=\"viewport\"/>\n" +
        "<!--[if !mso]><!-->\n" +
        "<meta content=\"IE=edge\" http-equiv=\"X-UA-Compatible\"/>\n" +
        "<!--<![endif]-->\n" +
        "<title></title>\n" +
        "<!--[if !mso]><!-->\n" +
        "<!--<![endif]-->\n" +
        "<style type=\"text/css\">\n" +
        "\t\tbody {\n" +
        "\t\t\tmargin: 0;\n" +
        "\t\t\tpadding: 0;\n" +
        "\t\t}\n" +
        "\n" +
        "\t\ttable,\n" +
        "\t\ttd,\n" +
        "\t\ttr {\n" +
        "\t\t\tvertical-align: top;\n" +
        "\t\t\tborder-collapse: collapse;\n" +
        "\t\t}\n" +
        "\n" +
        "\t\t* {\n" +
        "\t\t\tline-height: inherit;\n" +
        "\t\t}\n" +
        "\n" +
        "\t\ta[x-apple-data-detectors=true] {\n" +
        "\t\t\tcolor: inherit !important;\n" +
        "\t\t\ttext-decoration: none !important;\n" +
        "\t\t}\n" +
        "\t</style>\n" +
        "<style id=\"media-query\" type=\"text/css\">\n" +
        "\t\t@media (max-width: 520px) {\n" +
        "\n" +
        "\t\t\t.block-grid,\n" +
        "\t\t\t.col {\n" +
        "\t\t\t\tmin-width: 320px !important;\n" +
        "\t\t\t\tmax-width: 100% !important;\n" +
        "\t\t\t\tdisplay: block !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.block-grid {\n" +
        "\t\t\t\twidth: 100% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.col {\n" +
        "\t\t\t\twidth: 100% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.col_cont {\n" +
        "\t\t\t\tmargin: 0 auto;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\timg.fullwidth,\n" +
        "\t\t\timg.fullwidthOnMobile {\n" +
        "\t\t\t\tmax-width: 100% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col {\n" +
        "\t\t\t\tmin-width: 0 !important;\n" +
        "\t\t\t\tdisplay: table-cell !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack.two-up .col {\n" +
        "\t\t\t\twidth: 50% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col.num2 {\n" +
        "\t\t\t\twidth: 16.6% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col.num3 {\n" +
        "\t\t\t\twidth: 25% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col.num4 {\n" +
        "\t\t\t\twidth: 33% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col.num5 {\n" +
        "\t\t\t\twidth: 41.6% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col.num6 {\n" +
        "\t\t\t\twidth: 50% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col.num7 {\n" +
        "\t\t\t\twidth: 58.3% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col.num8 {\n" +
        "\t\t\t\twidth: 66.6% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col.num9 {\n" +
        "\t\t\t\twidth: 75% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.no-stack .col.num10 {\n" +
        "\t\t\t\twidth: 83.3% !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.video-block {\n" +
        "\t\t\t\tmax-width: none !important;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.mobile_hide {\n" +
        "\t\t\t\tmin-height: 0px;\n" +
        "\t\t\t\tmax-height: 0px;\n" +
        "\t\t\t\tmax-width: 0px;\n" +
        "\t\t\t\tdisplay: none;\n" +
        "\t\t\t\toverflow: hidden;\n" +
        "\t\t\t\tfont-size: 0px;\n" +
        "\t\t\t}\n" +
        "\n" +
        "\t\t\t.desktop_hide {\n" +
        "\t\t\t\tdisplay: block !important;\n" +
        "\t\t\t\tmax-height: none !important;\n" +
        "\t\t\t}\n" +
        "\t\t}\n" +
        "\t</style>\n" +
        "</head>\n" +
        "<body class=\"clean-body\" style=\"margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: transparent;\">\n" +
        "<!--[if IE]><div class=\"ie-browser\"><![endif]-->\n" +
        "<table bgcolor=\"transparent\" cellpadding=\"0\" cellspacing=\"0\" class=\"nl-container\" role=\"presentation\" style=\"table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; width: 100%;\" valign=\"top\" width=\"100%\">\n" +
        "<tbody>\n" +
        "<tr style=\"vertical-align: top;\" valign=\"top\">\n" +
        "<td style=\"word-break: break-word; vertical-align: top;\" valign=\"top\">\n" +
        "<!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"background-color:transparent\"><![endif]-->\n" +
        "<div style=\"background-color:#ffffff;\">\n" +
        "<div class=\"block-grid\" style=\"min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #202028;\">\n" +
        "<div style=\"border-collapse: collapse;display: table;width: 100%;background-color:#202028;\">\n" +
        "<!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background-color:#ffffff;\"><tr><td align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:500px\"><tr class=\"layout-full-width\" style=\"background-color:#202028\"><![endif]-->\n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"500\" style=\"background-color:#202028;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;\" valign=\"top\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 5px; padding-left: 5px; padding-top:5px; padding-bottom:5px;\"><![endif]-->\n" +
        "<div class=\"col num12\" style=\"min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;\">\n" +
        "<div class=\"col_cont\" style=\"width:100% !important;\">\n" +
        "<!--[if (!mso)&(!IE)]><!-->\n" +
        "<div style=\"border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 5px; padding-left: 5px;\">\n" +
        "<!--<![endif]-->\n" +
        "<div align=\"center\" class=\"img-container center fixedwidth\" style=\"padding-right: 0px;padding-left: 0px;\">\n" +
        "<!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr style=\"line-height:0px\"><td style=\"padding-right: 0px;padding-left: 0px;\" align=\"center\"><![endif]--><img align=\"center\" alt=\"I'm an image\" border=\"0\" class=\"center fixedwidth\" src=\"images/1.png\" style=\"text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 147px; display: block;\" title=\"I'm an image\" width=\"147\"/>\n" +
        "<!--[if mso]></td></tr></table><![endif]-->\n" +
        "</div>\n" +
        "<div align=\"center\" class=\"img-container center autowidth\" style=\"padding-right: 0px;padding-left: 0px;\">\n" +
        "<!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr style=\"line-height:0px\"><td style=\"padding-right: 0px;padding-left: 0px;\" align=\"center\"><![endif]--><img align=\"center\" border=\"0\" class=\"center autowidth\" src=\"images/Logo.png\" style=\"text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 490px; display: block;\" width=\"490\"/>\n" +
        "<!--[if mso]></td></tr></table><![endif]-->\n" +
        "</div>\n" +
        "<!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif\"><![endif]-->\n" +
        "<div style=\"color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;\">\n" +
        "<div class=\"txtTinyMce-wrapper\" style=\"line-height: 1.2; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;\">\n" +
        "<p style=\"margin: 0; font-size: 22px; line-height: 1.2; text-align: center; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;\"><span style=\"color: #ffffff; font-size: 22px;\"><strong>Thanks for your registration!</strong></span></p>\n" +
        "</div>\n" +
        "</div>\n" +
        "<!--[if mso]></td></tr></table><![endif]-->\n" +
        "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"divider\" role=\"presentation\" style=\"table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;\" valign=\"top\" width=\"100%\">\n" +
        "<tbody>\n" +
        "<tr style=\"vertical-align: top;\" valign=\"top\">\n" +
        "<td class=\"divider_inner\" style=\"word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;\" valign=\"top\">\n" +
        "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"divider_content\" role=\"presentation\" style=\"table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;\" valign=\"top\" width=\"100%\">\n" +
        "<tbody>\n" +
        "<tr style=\"vertical-align: top;\" valign=\"top\">\n" +
        "<td style=\"word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;\" valign=\"top\"><span></span></td>\n" +
        "</tr>\n" +
        "</tbody>\n" +
        "</table>\n" +
        "</td>\n" +
        "</tr>\n" +
        "</tbody>\n" +
        "</table>\n" +
        "<!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif\"><![endif]-->\n" +
        "<div style=\"color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;\">\n" +
        "<div class=\"txtTinyMce-wrapper\" style=\"line-height: 1.2; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;\">\n" +
        "<p style=\"margin: 0; font-size: 16px; line-height: 1.2; text-align: center; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 19px; margin-top: 0; margin-bottom: 0;\"><span style=\"color: #ffffff; font-size: 16px;\">Dear " + user.firstname + " " +  user.lastname + ",</span></p>\n" +
        "<p style=\"margin: 0; font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;\"><br/><span style=\"color: #ffffff; font-size: 16px;\">there is just one more step to do before your registration is complete and you can start an active and healthy life! Press the button below to confirm your registration or paste the link below in your browser: </span></p>\n" +
        "</div>\n" +
        "</div>\n" +
        "<!--[if mso]></td></tr></table><![endif]-->\n" +
        "<div align=\"center\" class=\"button-container\" style=\"padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;\">\n" +
        "<!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;\"><tr><td style=\"padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px\" align=\"center\"><v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" href=\"\" style=\"height:31.5pt;width:94.5pt;v-text-anchor:middle;\" arcsize=\"10%\" stroke=\"false\" fillcolor=\"#00c4a7\"><w:anchorlock/><v:textbox inset=\"0,0,0,0\"><center style=\"color:#ffffff; font-family:Arial, sans-serif; font-size:16px\"><![endif]-->\n" +
        "<div style=\"text-decoration:none;display:inline-block;color:#ffffff;background-color:#00c4a7;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #00c4a7;border-right:1px solid #00c4a7;border-bottom:1px solid #00c4a7;border-left:1px solid #00c4a7;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;\"><span style=\"padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:undefined;\"><span style=\"line-height: 32px;\">\n" +
        "<p data-mce-style=\"font-size: 16px; margin: 0; line-height: 32px;\" style=\"font-size: 16px; margin: 0; line-height: 32px; font-family: inherit; word-break: break-word;\"><a href=\"" + BACKEND_URL + "verify/" + user.confirmationToken + "\">Verify</a></p>\n" +
        "</span></span></div>\n" +
        "<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->\n" +
        "</div>\n" +
        "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"divider\" role=\"presentation\" style=\"table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;\" valign=\"top\" width=\"100%\">\n" +
        "<tbody>\n" +
        "<tr style=\"vertical-align: top;\" valign=\"top\">\n" +
        "<td class=\"divider_inner\" style=\"word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;\" valign=\"top\">\n" +
        "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"divider_content\" role=\"presentation\" style=\"table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;\" valign=\"top\" width=\"100%\">\n" +
        "<tbody>\n" +
        "<tr style=\"vertical-align: top;\" valign=\"top\">\n" +
        "<td style=\"word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;\" valign=\"top\"><span></span></td>\n" +
        "</tr>\n" +
        "</tbody>\n" +
        "</table>\n" +
        "</td>\n" +
        "</tr>\n" +
        "</tbody>\n" +
        "</table>\n" +
        "<!--[if (!mso)&(!IE)]><!-->\n" +
        "</div>\n" +
        "<!--<![endif]-->\n" +
        "</div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n" +
        "<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\n" +
        "</div>\n" +
        "</div>\n" +
        "</div>\n" +
        "<div style=\"background-color:#ffffff;\">\n" +
        "<div class=\"block-grid two-up\" style=\"min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #202028;\">\n" +
        "<div style=\"border-collapse: collapse;display: table;width: 100%;background-color:#202028;\">\n" +
        "<!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background-color:#ffffff;\"><tr><td align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:500px\"><tr class=\"layout-full-width\" style=\"background-color:#202028\"><![endif]-->\n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"250\" style=\"background-color:#202028;width:250px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;\" valign=\"top\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;\"><![endif]-->\n" +
        "<div class=\"col num6\" style=\"display: table-cell; vertical-align: top; max-width: 320px; min-width: 246px; width: 250px;\">\n" +
        "<div class=\"col_cont\" style=\"width:100% !important;\">\n" +
        "<!--[if (!mso)&(!IE)]><!-->\n" +
        "<div style=\"border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;\">\n" +
        "<!--<![endif]-->\n" +
        "<!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif\"><![endif]-->\n" +
        "<div style=\"color:#ffffff;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;\">\n" +
        "<div class=\"txtTinyMce-wrapper\" style=\"line-height: 1.2; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #ffffff; mso-line-height-alt: 14px;\">\n" +
        "<p style=\"margin: 0; font-size: 18px; line-height: 1.2; text-align: left; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 22px; margin-top: 0; margin-bottom: 0;\"><strong><span style=\"color: #ffffff;\">Who are we?</span></strong></p>\n" +
        "</div>\n" +
        "</div>\n" +
        "<!--[if mso]></td></tr></table><![endif]-->\n" +
        "<!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif\"><![endif]-->\n" +
        "<div style=\"color:#C0C0C0;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;\">\n" +
        "<div class=\"txtTinyMce-wrapper\" style=\"line-height: 1.2; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #C0C0C0; mso-line-height-alt: 14px;\">\n" +
        "<p style=\"margin: 0; font-size: 12px; line-height: 1.2; text-align: left; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;\"><span style=\"color: #C0C0C0; font-size: 12px;\">We are a small group of students, that did </span></p>\n" +
        "<p style=\"margin: 0; font-size: 12px; line-height: 1.2; text-align: left; word-break: break-word; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;\"><span style=\"color: #C0C0C0; font-size: 12px;\">this project for our Web-Engineering assignement at DHBW.</span></p>\n" +
        "</div>\n" +
        "</div>\n" +
        "<!--[if mso]></td></tr></table><![endif]-->\n" +
        "<div style=\"font-size:16px;text-align:center;font-family:Arial, Helvetica Neue, Helvetica, sans-serif\">\n" +
        "<div style=\"height:20px;\"> </div>\n" +
        "</div>\n" +
        "<!--[if (!mso)&(!IE)]><!-->\n" +
        "</div>\n" +
        "<!--<![endif]-->\n" +
        "</div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n" +
        "<!--[if (mso)|(IE)]></td><td align=\"center\" width=\"250\" style=\"background-color:#202028;width:250px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;\" valign=\"top\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;\"><![endif]-->\n" +
        "<div class=\"col num6\" style=\"display: table-cell; vertical-align: top; max-width: 320px; min-width: 246px; width: 250px;\">\n" +
        "<div class=\"col_cont\" style=\"width:100% !important;\">\n" +
        "<!--[if (!mso)&(!IE)]><!-->\n" +
        "<div style=\"border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;\">\n" +
        "<!--<![endif]-->\n" +
        "<!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif\"><![endif]-->\n" +
        "<div style=\"color:#ffffff;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;\">\n" +
        "<div class=\"txtTinyMce-wrapper\" style=\"line-height: 1.2; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #ffffff; mso-line-height-alt: 14px;\"><span style=\"\">\n" +
        "<p style=\"margin: 0; font-size: 18px; line-height: 1.2; text-align: left; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: 22px; margin-top: 0; margin-bottom: 0;\"><strong><span style=\"color: #ffffff;\">Where to find us</span></strong></p>\n" +
        "</span></div>\n" +
        "</div>\n" +
        "<!--[if mso]></td></tr></table><![endif]-->\n" +
        "<!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif\"><![endif]-->\n" +
        "<div style=\"color:#C0C0C0;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;\">\n" +
        "<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; line-height: 1.2; color: #C0C0C0; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;\">\n" +
        "<p style=\"margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;\">Reply to this email: </p>\n" +
        "<p style=\"margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;\"> </p>\n" +
        "<p style=\"margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;\">workouttracker.dhbw@gmail.com</p>\n" +
        "</div>\n" +
        "</div>\n" +
        "<!--[if mso]></td></tr></table><![endif]-->\n" +
        "<!--[if (!mso)&(!IE)]><!-->\n" +
        "</div>\n" +
        "<!--<![endif]-->\n" +
        "</div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n" +
        "<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\n" +
        "</div>\n" +
        "</div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n" +
        "</td>\n" +
        "</tr>\n" +
        "</tbody>\n" +
        "</table>\n" +
        "<!--[if (IE)]></div><![endif]-->\n" +
        "</body>\n" +
        "</html>"
    );
}
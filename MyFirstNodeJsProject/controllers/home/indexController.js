const { TABLES } = require('../../config/constants');
var con = require('../../models/dbconnection');

module.exports = {

        /*
         Function Name : index
         Function Desc : This function is for landing Admin Login Page
         Created By    : Dev-162
         */

        index: function(req, res, next) {
            try {
                data = {
                    title: "Educational registration form",
                    company_name: "Wegile",
                }
                res.render('index', data);

                // res.render('admin/index', {
                //     layout: false,

                // })
            } catch (e) {
                console.log('You are in login catch');
                res.render('404', {
                    layout: false,

                })
            }
        },
        /*
         Function Name : login
         Function Desc : This function is submitting Admin Login Form
         Created By    : Dev-162
         */
        login: function(req, res, next) {
            try {
                let email = "admin@rtsgerdgf.com";
                // sqlQuery = "SELECT * FROM " + TABLES.EMPLOYEE + " WHERE email = ?";
                sqlQuery = "SELECT * FROM fgc_db.fgc_employee"
                let sqlArray = [email];

                con.query(sqlQuery, sqlArray, async function(error, result) {
                    if (error) {
                        console.log("Threr is error-----", error)
                        res.render('index', {
                            layout: false,
                            title: "Educational registration form",
                            company_name: "Fail",
                            verify: false,
                            error: true,
                            message: 'Please check your email and password'
                        });
                    } else {
                        // await req.flash('error', 'Please check your credentials');
                        data = {
                            title: "Educational registration form",
                            company_name: "Wegile Success",
                        }
                        res.render('index', data);
                        console.log(result)
                    }
                });

            } catch (e) {
                console.log('You are in login catch error', e);

                res.render('404', {
                    layout: false,

                })
            }
        },
        logout: function(req, res, next) {

            req.session.signInEmail = "";
            req.session = null
            res.redirect('/admin');

        },
        resetYourPassword: async function(req, res) {
            try {
                let post = req.body;
                console.log('post', post);
                let verifyEmail = "SELECT * FROM " + TABLES.ADMIN + " WHERE email = ?";
                let sqlArray = [post.fgc_email];
                dbconnection.query(verifyEmail, sqlArray, async function(verifyEmailErr, verifyEmailRows) {
                    if (verifyEmailErr) {
                        await req.flash('error', 'Something went wrong. Please try again!');
                        res.redirect('/admin');
                    } else {

                        if (verifyEmailRows.length > 0) {

                            var token = Math.random().toString(36).substr(2, 8);
                            //var sent = sendEmail(post.fgc_email, token);

                            let eData = {

                                IMAGE: IMAGE_URL + 'images/Logo.png',
                                TOKEN: SITE_URL + 'admin/reset-your-password/' + token
                            };

                            //insert reset password Data query

                            let insertQuery = "INSERT INTO " + TABLES.RESETPASSWORD + " SET user_id=?,token=?,created_on = now(),expiring_on =? ";
                            let current_date = moment(new Date()).format("YYYY-MM-DD");
                            console.log(current_date, 'current_date');
                            let expiring_date = moment(current_date, "YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD");
                            console.log('expiring_date', expiring_date);
                            let insertArray = [verifyEmailRows[0].id, token, expiring_date]
                            dbconnection.query(insertQuery, insertArray, async function(err, result) {
                                if (err) {
                                    await req.flash('error', 'Token is not generated for Reset Password, Please try again');
                                    res.redirect('/admin');
                                } else if (result.affectedRows == '1') {
                                    let sendEmail = await EmailHelper.sentMail('resetPassword', post.fgc_email, eData, { html: true, subject: 'Password Changed - FGC' });
                                    if (sendEmail) {
                                        await req.flash('success', 'Please Check your email to reset your password');
                                        res.redirect('/admin');
                                    } else {
                                        await req.flash('error', 'Please try again');
                                        res.redirect('/admin');
                                    }
                                } else {
                                    await req.flash('error', 'Sorry for the incovienence, Please try again');
                                    res.redirect('/admin');
                                }
                            });

                            //insert reset password Data query ends here


                        } else {
                            await req.flash('error', 'The Email is not registered with us');
                            res.redirect('/admin');
                        }
                    }
                })
            } catch (e) {
                console.log('error', e)
            }


        },
        resetPassword: async function(req, res, next) {
            try {
                let token_id = req.params.token;
                let current_date = moment(new Date()).format("YYYY-MM-DD");

                let sqlQuery = "SELECT * FROM " + TABLES.RESETPASSWORD + " WHERE token = ? AND expiring_on >= ?";

                let sqlArray = [token_id, current_date];
                dbconnection.query(sqlQuery, sqlArray, async function(error, result) {
                    if (error) {
                        await req.flash('error', 'Please try again!');
                        res.redirect('/admin');
                    } else {
                        if (result.length == '0') {
                            await req.flash('error', 'Your Link is expired , Please try again');
                            res.redirect('/admin');
                        } else {
                            res.render('admin/reset-password', {
                                layout: false,
                                token_id: token_id

                            })
                        }

                    }
                });
                //res.json('hi');
            } catch (e) {
                await req.flash('error', 'Please try again!');
                res.redirect('/admin');
            }
        },
        updateResetPassword: async function(req, res, next) {
            try {
                let token_id = req.body.token_id;
                let confirm_password = req.body.confirm_password;
                let encryptPassword = helper.password(confirm_password);

                let sqlQuery = "SELECT * FROM " + TABLES.RESETPASSWORD + " WHERE token = ?";
                let sqlArray = [token_id];
                dbconnection.query(sqlQuery, sqlArray, async function(error, result) {
                    let user_id = result[0].user_id;
                    let delete_id = result[0].id
                    let updateQuery = "UPDATE " + TABLES.ADMIN + " SET password = ? WHERE id = ?";
                    let updatedArray = [encryptPassword, user_id];
                    dbconnection.query(updateQuery, updatedArray, async function(error, result) {
                        if (error) {
                            await req.flash('error', 'Please try again!');
                            res.redirect('/admin/reset-password/' + token_id);
                        } else if (result.affectedRows == '1') {

                            let deleteQuery = "DELETE FROM " + TABLES.RESETPASSWORD + " WHERE id =?";
                            let deleteArray = [delete_id]
                            dbconnection.query(deleteQuery, deleteArray, async function(deleteerror, data) {
                                if (deleteerror) {
                                    await req.flash('error', 'Password not updated,Please try again!');
                                    res.redirect('/admin/reset-password/' + token_id);
                                } else {
                                    await req.flash('success', 'Password Updated Successfully, Please login again!');
                                    res.redirect('/admin');
                                }
                            });

                        } else {
                            await req.flash('error', 'Please try again!');
                            res.redirect('/admin/reset-password/' + token_id);
                        }
                    });

                });
            } catch (e) {
                await req.flash('error', 'Please try again!');
                res.redirect('/admin');
            }
        }

    } // end of module exports
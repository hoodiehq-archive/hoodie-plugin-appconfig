$(function () {
    var hoodieAdmin = top.hoodieAdmin;
    $('[name=emailService]').on('change', updateForm);

    function getConfig(callback) {
      hoodieAdmin.request('GET', '/app/config')
        .fail(function(error) { callback(error); })
        .done(function(response) { callback(null, response); })
    }
    function setConfig(doc, callback) {
      hoodieAdmin.request('PUT', '/app/config', {
        data: JSON.stringify(doc)
      })
        .fail(function(error) { callback(error); })
        .done(function(response) { callback(null, response); })
    }

    function updateConfig(obj, callback) {
        getConfig(function (err, doc) {
            if (err) {
                return callback(err);
            }
            doc.config = _.extend(doc.config, obj);
            setConfig(doc, callback);
        });
    }

    // set initial form values
    getConfig(function (err, doc) {
        if (err) {
            return alert(err);
        }
        $('[name=appName]').val(doc.config.app_name);
        $('[name=fromEmail]').val(doc.config.email_from);
        $('[name=emailService]').select2('val', doc.config.email_service);
        $('[name=emailUsername]').val(doc.config.email_user);
        $('[name=emailPassword]').val(doc.config.email_pass);
        $('[name=emailHost]').val(doc.config.email_host);
        $('[name=emailPort]').val(doc.config.email_port);
        if(!doc.config.email_secure){
          $('#secure').iCheck('uncheck');
        }
        updateForm();
    });

    function updateForm(){
      var withAPIKey = ['Mandrill', 'Sendgrid'];
      var emailService = $('[name=emailService]').select2('val');
      if(withAPIKey.indexOf(emailService) === -1){
        // without api
        $('.hideIfAPI').show();
        $('.showIfAPI').hide().val('');
      } else {
        // with api key
        $('.hideIfAPI').hide().val('');
        $('.showIfAPI').show();
      }
      if(emailService === 'SMTP'){
        $('.showIfSMTP').show();
      } else {
        $('.showIfSMTP').hide().val('');
      }
    }

    function setSubmitButtonToSaving(form){
        $btn = $(form).find('button[type="submit"]');
        $btn.data('originalButtonText', $btn.text());
        $btn.data('disabled', 'disabled');
        $btn.text('Saving');
    }

    function setSubmitButtonToSuccess(form){
        $btn.text('Successfully saved!').addClass('success');
        _.delay(function(){
            $(form).find('button[type="submit"]').data('disabled', null);
            $btn.text($btn.data('originalButtonText')).removeClass('success');;
        }, 2000);
    }

    function setSubmitButtonToError(form, error){
        $btn.text('Something went wrong, sorry.').addClass('error');
        $btn.after('<p class="help-block">'+error+'</p>');
        _.delay(function(){
            $(form).find('button[type="submit"]').data('disabled', null);
            $btn.text($btn.data('originalButtonText')).removeClass('error');;
        }, 2000);
    }

    // save app info on submit
    $('#appInfoForm').submit(function (ev) {
        var el = this;
        ev.preventDefault();
        setSubmitButtonToSaving(this);
        var cfg = {
            app_name: $('[name=appName]').val()
        };
        updateConfig(cfg, function (err) {
            if (err) {
                setSubmitButtonToError(el, err);
                //return alert(err);
            }
            else {
                setSubmitButtonToSuccess(el);
            }
        });
        return false;
    });

    // save config on submit
    $('#emailForm').submit(function (ev) {
        var el = this;
        ev.preventDefault();
        setSubmitButtonToSaving(this);
        var cfg = {
            email_from: $('[name=fromEmail]').val(),
            email_host: $('[name=emailHost]').val(),
            email_port: $('[name=emailPort]').val(),
            email_user: $('[name=emailUsername]').val(),
            email_pass: $('[name=emailPassword]').val(),
            email_secure: $('#secure').is(":checked"),
            email_service: $('[name=emailService]').select2('val')
        };
        updateConfig(cfg, function (err) {
            if (err) {
                return alert(err);
            }
            else {
                setSubmitButtonToSuccess(el);
            }
        });
        return false;
    });

});

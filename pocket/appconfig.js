$(function () {

    var getConfig = _.partial(couchr.get, '/_api/app/config');
    var setConfig = _.partial(couchr.put, '/_api/app/config');

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
        $('[name=emailService]').val(doc.config.email_service);
        $('[name=emailUsername]').val(doc.config.email_user);
        $('[name=emailPassword]').val(doc.config.email_pass);
    });

    // save config on submit
    $('#emailForm').submit(function (ev) {
        ev.preventDefault();
        var cfg = {
            email_host: null,
            email_port: null,
            email_user: $('[name=emailUsername]').val(),
            email_pass: $('[name=emailPassword]').val(),
            email_secure: null,
            email_service: $('[name=emailService]').val()
        };
        updateConfig(cfg, function (err) {
            if (err) {
                return alert(err);
            }
            else {
                alert('Config saved');
            }
        });
        return false;
    });

});

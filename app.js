const CSV_URL = 'https://recario-space.ams3.digitaloceanspaces.com/Instagram.csv';



try{
  if ('localStorage' in window && window.localStorage !== null) {
    localStorage.setItem('testLocalStorage', 'testLocalStorage');
    if (localStorage.getItem('testLocalStorage') !== 'testLocalStorage') {
        localStorage.removeItem('testLocalStorage');
        //for private browsing, error is thrown before even getting here
        alert('can read CANNOT write'); 
    }else{
        localStorage.removeItem('testLocalStorage');
        alert('can use');
    }
  }else{
    alert('CANNOT use');
  }
}catch(ex){
  alert('CANNOT use reliably');
}


(function(){
    if (typeof define === 'function' && define.amd)
        define('autoComplete', function () { return autoComplete; });
    else if (typeof module !== 'undefined' && module.exports)
        module.exports = autoComplete;
    else
        window.autoComplete = autoComplete;
})();

if (localStorage.getItem('data') === null) {
    reloadData();
} else {
    checkUpdates();
}

function checkUpdates() {
    $.ajax({
        type: 'HEAD',
        async: true,
        cache: false,
        url: CSV_URL,
    }).done(function(data, status, xhr) {
        var newLastModified = xhr.getResponseHeader('last-modified');
        var currentLastModified = localStorage.getItem('lastModified');

        if (currentLastModified === newLastModified) {
            dbg('Retrieving data from LocalStorage');
            initialize(localStorage.getItem('data'));
        } else {
            reloadData();
        }
    });
}

function reloadData() {
    dbg('Fetching data');
    $.ajax({
        url: CSV_URL,
        cache: false,
    }).done(function(data, status, xhr){
        var lastModified = xhr.getResponseHeader('last-modified');
        dbg('Started storing data');
        localStorage.setItem('data', data);
        localStorage.setItem('lastModified', lastModified);
        dbg('Finished storing data');
        initialize(data);
     });
}

function initialize(accounts) {
    dbg('Initialized');
    accounts = accounts.split(/\r?\n/).map(line => {
        let t = line.split(';');
        return { id: t[0], name: t[1] }
    });

    new autoComplete({
        selector: "input[name='search']",
        cache: false,
        minChars: 1,
        source: function(term, response) {
            data = accounts.filter(line => line.name.match(term)).slice(0,10)
            $('.account-name').text('');
            $('#success').html('');

            if (data.length === 0) {
                $('#not-found').removeClass('d-none');
                $('#success').addClass('d-none');
                $('.account-name').text($('input[name=search]')[0].value);
                response(data);
            } else if (data.length === 1) {
                $('#success').removeClass('d-none');
                $('#success').html(`<H2>ПОЗДРАВЛЯЕМ</H2><p>Ваш аккаунт <b>${data[0].name}</b> принимает участие в розыгрыше</p><p>Ваш счастливый номер: <b>${data[0].id}</b></p><H3>Удачи!</H3>`);
                $('#results').addClass('success');
                $('#not-found').addClass('d-none');
                $('#success')[0].scrollIntoView();
                response([]);
            } else {
                $('#not-found').addClass('d-none');
                $('#success').addClass('d-none');
                response(data);
            }
        },
        renderItem: function (item, search) {
          var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
          return `<div class="autocomplete-suggestion" data-name="${item.name}" data-id="${item.id}">${item.name.replace(re, "<b>$1</b>")}</div>`;
        },
        onSelect: function(e, term, item) {
          $('#success').removeClass('d-none');
          $('#success').html(`<H2>ПОЗДРАВЛЯЕМ</H2><p>Ваш аккаунт <b>${$(item).data('name')}</b> принимает участие в розыгрыше</p><p>Ваш счастливый номер: <b>${$(item).data('id')}</b></p><H3>Удачи!</H3>`);
          $('#results').addClass('success');
          $('#not-found').addClass('d-none');
        }
    });
}

function dbg(str) {
    // console.log(arguments)
    $('#ads').append("<br>", str, "<br>")
} 
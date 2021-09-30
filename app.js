const CSV_URL = 'https://recario-space.ams3.digitaloceanspaces.com/Instagram.csv.gz';

$('#search-wrapper').hide();
$('#spinner-container').show();

$.get(CSV_URL, (data) => initialize(data));


function initialize(accounts) {
    console.log('Initialized');
    accounts = accounts.split(/\r?\n/).map(line => {
        let t = line.split(';');
        return { id: t[0], name: t[1] }
    }).filter(line => !!(line.id && line.name));

    new autoComplete({
        selector: "input[name='search']",
        cache: false,
        minChars: 1,
        source: function(term, response) {
            data = accounts.filter(line => line.name.toLowerCase().match(term.toLowerCase())).slice(0,10)
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

    $('#search-wrapper').show();
    $('#spinner-container').hide();
}

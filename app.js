var serverURL = 'https://dreamcar-results-reader-axr6x.ondigitalocean.app';
// var serverURL = 'http://example.com';
var $spinner = $('#spinner');
var $prompt = $('#prompt');
var $success = $('#success');
var $results = $('#results');
var $serverError = $('#server-error');
var $notFound = $('#not-found');
var $accountName = $('.account-name');
var $search = $('input[name=search]');

var retriesAvailableCount = 1;

$('#search').onclick = searchAccount;
$('form').onsubmit = function (event) { event.preventDefault(); }

// Utils

function $(selector) {
  return document.querySelector(selector);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function normalizeAccountName(n) {
  return n.trim().replace(/https:\/\/www.instagram.com\//, '')
                 .replace(/https:\/\/instagram.com\//, '')
                 .replace(/\?.+$/, '')
                 .replace(/\//,'');
}

function extractSearchValue() {
  return normalizeAccountName($search.value);
}

// Utils

// Events

function onLoad(event) {
  var searchValue = extractSearchValue();
  var accountID;

  try {
    accountID = JSON.parse(event.target.response)[searchValue];
  } catch (error) {
    console.log(error);
  }

  if (accountID) {
    $spinner.classList.add('d-none');
    $spinner.classList.remove('d-flex');
    $success.classList.remove('d-none');
    $success.innerHTML = `<H2>ПОЗДРАВЛЯЕМ</H2><p>Ваш аккаунт <b>${searchValue}</b> принимает участие в розыгрыше</p><p>Ваш счастливый номер: <b>${accountID}</b></p><H3>Удачи!</H3>`;
    $results.classList.add('success');
  } else {
    $spinner.classList.add('d-none');
    $spinner.classList.remove('d-flex');
    $success.classList.add('d-none');
    $success.innerText = '';

    $accountName.innerText = searchValue;

    $notFound.classList.remove('d-none');
    $results.classList.add('error');

  }
}

function onError(event) {
  if (retriesAvailableCount > 0) {
    retriesAvailableCount--;
    setTimeout(function() { searchAccount() }, getRandomArbitrary(300, 1000));
  } else {
    displayServerError();
    retriesAvailableCount++;
  }
}

// Events


// DOM

function displayServerError() {
  $spinner.classList.remove('d-none');
  $spinner.classList.remove('d-flex');
  $spinner.classList.add('d-none');

  $serverError.classList.remove('d-none');

  $results.classList.remove('error');
  $results.classList.remove('success');
  $results.classList.remove('warning');
  $results.classList.add('warning');
}

function resetState() {
  $notFound.classList.remove('d-none');
  $notFound.classList.add('d-none');

  $success.classList.remove('d-none');
  $success.classList.add('d-none');

  $spinner.classList.remove('d-none');
  $spinner.classList.remove('d-flex');
  $spinner.classList.add('d-none');

  $results.classList.remove('error');
  $results.classList.remove('success');
  $results.classList.remove('warning');

  $serverError.classList.remove('d-none');
  $serverError.classList.add('d-none');
}

function showSpinner() {
  $prompt.classList.add('d-none');
  $spinner.classList.remove('d-none');
  $spinner.classList.add('d-flex');
}

// DOM

function searchAccount() {
  if (extractSearchValue() === '') { return }

  resetState();
  showSpinner();
  var searchValue = extractSearchValue();

  var xhr = new XMLHttpRequest();
  xhr.open('GET', `${serverURL}/${searchValue}`, true);

  xhr.onload = onLoad;

  xhr.onerror = onError;

  xhr.send(null);
}

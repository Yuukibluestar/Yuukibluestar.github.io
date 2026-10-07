// Dropdown menu: click/tap/keyboard toggle, click-outside and Escape to close
function closeDropdown(item) {
  item.classList.remove('open');
  item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
}

document.querySelectorAll('.dropdown-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const isOpen = btn.parentElement.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
});

document.addEventListener('click', (e) => {
  document.querySelectorAll('.has-dropdown.open').forEach((item) => {
    if (!item.contains(e.target)) closeDropdown(item);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.has-dropdown.open').forEach((item) => {
    closeDropdown(item);
    item.querySelector('.dropdown-toggle').focus();
  });
});

const burger = document.querySelector('.header-burger')
const navList = document.querySelector('.header-nav_list')

burger.addEventListener('click', function (){
    burger.classList.toggle('active')
    navList.classList.toggle('active')
})
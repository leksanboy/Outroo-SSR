Username: AKS
Name: AKS
Email: aleksandkinash90@gmail.com
Password: qweqwe_AKS

# NOTE

 - в HomeComonent.ngOnInit() для activeTextEffect используется setTimeout
   при выполнении на стороне сервера не желательно его использовать 
   т.к. не корректно будет отрабатывать хук роутинга NavigationEnd :: после NavigationEnd останется асинхронный код


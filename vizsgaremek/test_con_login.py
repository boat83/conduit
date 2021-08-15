def test_con_login():
    from selenium import webdriver
    import time

    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager

    opt = Options()
    opt.headless = True
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=opt)

    driver.get('http://localhost:1667/#/')
    username = 'testuser1'
    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[2]/a').click()
    time.sleep(2)
    # bejelentkezes felhasznaloval
    driver.find_element_by_xpath('//input[@placeholder="Email"]').send_keys('testuser1@example.com')
    driver.find_element_by_xpath('//input[@placeholder="Password"]').send_keys('Abcd123$')
    driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/form/button').click()
    time.sleep(4)
    # bejelentkezett felhasznalonev azonositasa
    logedin_user = driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[4]/a').text

    assert username == logedin_user

    print('OK')

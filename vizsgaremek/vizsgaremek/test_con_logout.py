def test_con_logout():
    import time
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager

    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')

    # driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)  # headless
    driver = webdriver.Chrome(ChromeDriverManager().install())

    driver.get('http://localhost:1667/#/')
    username = 'testuser1'
    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[2]/a').click()
    time.sleep(2)

    driver.find_element_by_xpath('//input[@placeholder="Email"]').send_keys('testuser1@example.com')
    driver.find_element_by_xpath('//input[@placeholder="Password"]').send_keys('Abcd123$')
    driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/form/button').click()
    time.sleep(4)
    logedin_user = driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[4]/a').text

    assert username == logedin_user

    # kijelentkezes
    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[5]/a').click()
    # kijelentkezes megtortent vizsgalata
    signin_button = driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[2]/a').text
    assert signin_button == 'Sign in'
    print('Felhasznalo kijeletkezve')

    driver.close()
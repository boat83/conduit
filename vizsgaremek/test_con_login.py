def test_con_login():
    import time
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.common.exceptions import NoSuchElementException

    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')

    # driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)  # headless
    driver = webdriver.Chrome(ChromeDriverManager().install())

    try:
        driver.get('http://localhost:1667/#/')
        username = 'JohnRambo'
        driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[2]/a').click()
        time.sleep(2)

        driver.find_element_by_xpath('//input[@placeholder="Email"]').send_keys('Johnrambo@vizsgaremek.hu')
        driver.find_element_by_xpath('//input[@placeholder="Password"]').send_keys('Rambo1234++')
        driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/form/button').click()
        time.sleep(2)
        logedin_user = driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[4]/a').text

        assert username == logedin_user
        print('OK')

    finally:
        pass

def test_con_write_comment():
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

    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[2]/a').click()
    time.sleep(2)
    # bejelentkezes
    driver.find_element_by_xpath('//input[@placeholder="Email"]').send_keys('testuser1@example.com')
    driver.find_element_by_xpath('//input[@placeholder="Password"]').send_keys('Abcd123$')
    driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/form/button').click()
    time.sleep(4)

    driver.find_element_by_xpath('//*[@id="app"]/div/div[2]/div/div[1]/div[2]/div/div/div[1]/a/h1').click()
    time.sleep(2)
    # meglevo kommentek megszamlalasa
    counter = driver.find_elements_by_xpath('//div//p[@class="card-text"]')
    num_of_comment = len(counter)
    print(f'aktualis kommentek szama:  {str(num_of_comment)}')

    # 3 uj komment letrehozasa
    for i in range(3):
        textarea = driver.find_element_by_xpath('//*[@id="app"]/div/div[2]/div[2]/div/div/form/div[1]/textarea')
        textarea.send_keys('ha kicsi a tet a kedvem setet')
        post_comment = driver.find_element_by_xpath(
            '//*[@id="app"]/div/div[2]/div[2]/div/div/form/div[2]/button').click()
        time.sleep(2)
    driver.find_element_by_xpath('//span//i[@class="ion-trash-a"]').click()
    # kommentek ujboli megszamlalasa, elvart eredmeny a szamlalo 3-al novekszik
    new_counter = driver.find_elements_by_xpath('//div//p[@class="card-text"]')
    new_num_of_comment = len(new_counter)
    print(f'kommentek uj szama:  {str(new_num_of_comment)}')

    driver.close()

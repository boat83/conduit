def test_con_del_article():
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
    time.sleep(1)
    # bejelentkezes
    driver.find_element_by_xpath('//input[@placeholder="Email"]').send_keys('testuser4@example.com')
    driver.find_element_by_xpath('//input[@placeholder="Password"]').send_keys('Abcd123$')
    driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/form/button').click()
    time.sleep(3)

    driver.find_element_by_link_text('testuser4').click()
    time.sleep(6)
    # meglevo testuser3 kommentek megszamlalasa
    counter = driver.find_elements_by_xpath('//span[text()="Read more..."]')

    num_of_comment = len(counter)
    print(f'aktualis kommentek szama:  {str(num_of_comment)}')

    driver.find_element_by_xpath('//*[@id="app"]/div/div[2]/div/div/div[2]/div/div/div[1]/a/h1').click()
    time.sleep(4)
    driver.find_element_by_xpath('//*[@id="app"]/div/div[1]/div/div/span/button/span').click()

    driver.find_element_by_link_text('testuser4').click()
    time.sleep(5)
    new_counter = driver.find_elements_by_xpath('//span[text()="Read more..."]')
    new_num_of_comment = len(new_counter)
    print(f'aktualis kommentek torles utani szama:  {str(new_num_of_comment)}')

    assert (int(num_of_comment) - 1) == int(new_num_of_comment)

    driver.quit()

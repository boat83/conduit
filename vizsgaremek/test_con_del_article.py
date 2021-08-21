def test_con_del_article():
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager
    import time

    opt = Options()
    opt.headless = True
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=opt)

    driver.get('http://localhost:1667/#/')

    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[2]/a').click()
    time.sleep(2)
    # bejelentkezes
    driver.find_element_by_xpath('//input[@placeholder="Email"]').send_keys('testuser1@example.com')
    driver.find_element_by_xpath('//input[@placeholder="Password"]').send_keys('Abcd123$')
    driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/form/button').click()
    time.sleep(5)

    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[4]/a').click()
    time.sleep(5)
    # meglevo testuser4 kommentek megszamlalasa
    counter = driver.find_elements_by_xpath('//a/h1')

    num_of_comment = len(counter)
    print(f'aktualis kommentek szama:  {str(num_of_comment)}')
    time.sleep(4)
    driver.find_element_by_xpath('//*[@id="app"]/div/div[2]/div/div/div[2]/div/div/div[1]/a/h1').click()
    time.sleep(5)
    driver.find_element_by_xpath('//*[@id="app"]/div/div[1]/div/div/span/button/span').click()

    time.sleep(4)
    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[4]/a').click()
    time.sleep(5)
    new_counter = driver.find_elements_by_xpath('//span[text()="Read more..."]')
    new_num_of_comment = len(new_counter)
    print(f'aktualis kommentek torles utani szama:  {str(new_num_of_comment)}')
    time.sleep(4)
    assert (int(num_of_comment) - 1) == int(new_num_of_comment)

    driver.quit()
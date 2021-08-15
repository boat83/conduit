def test_con_update_data():
    import time
    from selenium import webdriver
    from webdriver_manager.chrome import ChromeDriverManager

    driver = webdriver.Chrome(ChromeDriverManager().install())

    driver.get('http://localhost:1667/#/')

    login_details = ['testuserMRX20', 'testuserMRX20@example.com', 'Abcd123$']
    updated_user_name = 'michaelcorleone'

    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[2]/a').click()
    time.sleep(1)

    # uj felhasznalo regisztralasa
    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[3]/a').click()
    time.sleep(1)

    driver.find_element_by_xpath('//input[@placeholder="Username"]').send_keys(login_details[0])
    driver.find_element_by_xpath('//input[@placeholder="Email"]').send_keys(login_details[1])
    driver.find_element_by_xpath('//input[@placeholder="Password"]').send_keys(login_details[2])
    driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/form/button').click()
    time.sleep(2)

    driver.find_element_by_class_name('swal-button-container').click()
    # beallitasok megjelenitese majd uj felhasznallonev rogzitese
    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[3]/a').click()
    time.sleep(3)
    driver.find_element_by_xpath('//input[@placeholder="Your username"]').clear()

    driver.find_element_by_xpath('//input[@placeholder="Your username"]').send_keys(updated_user_name)
    time.sleep(2)
    driver.find_element_by_xpath('//button[@class="btn btn-lg btn-primary pull-xs-right"]').click()
    time.sleep(3)
    driver.find_element_by_xpath('//button[@class="swal-button swal-button--confirm"]').click()
    # vizsgalat: felhasznalonev modosult
    assert updated_user_name == driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[4]/a').text

    driver.close()

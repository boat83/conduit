def test_con_cookie():
    from selenium import webdriver
    import time

    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager

    opt = Options()
    opt.headless = True
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=opt)

    # conduit oldalra navigalas
    driver.get('http://localhost:1667')
    time.sleep(2)
    driver.find_element_by_xpath('//div[@id="cookie-policy-panel"]//a').click()

    # ablak valtas
    driver.switch_to.window(driver.window_handles[-1])
    time.sleep(5)
    driver.close()
    # visszavaltas
    driver.switch_to.window((driver.window_handles[0]))
    time.sleep(5)
    # policy elfogadas
    driver.find_element_by_xpath('//*[@id="cookie-policy-panel"]/div/div[2]/button[2]/div').click()
    time.sleep(4)
    buttons = driver.find_elements_by_xpath('//div/button')
    assert len(buttons) == 0

    driver.close()
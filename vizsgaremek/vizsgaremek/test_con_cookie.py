def test_con_cookie():
    import time
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager

    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')

    # driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)  # headless

    driver = webdriver.Chrome(ChromeDriverManager().install())
    # conduit oldalra navigalas
    driver.get('http://localhost:1667')
    time.sleep(2)
    driver.find_element_by_xpath('//div[@id="cookie-policy-panel"]//a').click()

    # ablak valtas
    driver.switch_to.window(driver.window_handles[-1])
    time.sleep(4)
    driver.close()
    # visszavaltas
    driver.switch_to.window((driver.window_handles[0]))
    time.sleep(4)
    # policy elfogadas
    driver.find_element_by_xpath('//*[@id="cookie-policy-panel"]/div/div[2]/button[2]/div').click()
    time.sleep(2)
    buttons = driver.find_elements_by_xpath('//div/button')
    assert len(buttons) == 0

    driver.close()

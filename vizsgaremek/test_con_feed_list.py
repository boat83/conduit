def test_con_feed_list():
    from selenium import webdriver
    import time

    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager

    opt = Options()
    opt.headless = True
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=opt)

    driver.get('http://localhost:1667/#/login')
    # bejelentkezes
    driver.find_element_by_xpath('//fieldset//input[@placeholder="Email"]').send_keys('testuser1@example.com')
    driver.find_element_by_xpath('//fieldset//input[@placeholder="Password"]').send_keys('Abcd123$')
    driver.find_element_by_xpath('//form/button').click()
    time.sleep(2)

    driver.find_element_by_xpath('//div[@class="container"]//ul/li[4]/a').click()

    time.sleep(3)
    # cikkek cimeinek kigyujtese
    my_articles = driver.find_elements_by_xpath('//div[@class="article-preview"]//h1')

    list_of_feed = []
    for row in my_articles:
        list_of_feed.append(row.text + '\n')
    print(list_of_feed)
    # talalatok fileba mentese
    with open('list_of_feed.txt', 'a') as x:
        for i in list_of_feed:
            x.write(i)

    driver.close()

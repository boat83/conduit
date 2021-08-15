def test_con_upload_data2():

    import time
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager


    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')

    # driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)  # headless
    driver = webdriver.Chrome(ChromeDriverManager().install())

    driver.get("http://localhost:1667/#/")


    # Sign up oldalra navigalas
    sign_up = driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[3]/a')
    time.sleep(1)
    sign_up.click()


    def find_xpath(xpath):
        element = driver.find_element_by_xpath(xpath)
        return element


    # adat beolvasas txt filebol
    with open('userdata.txt') as data:
        lines = data.readlines()
    # user info kitoltes
    username = lines[0].replace("\n", "")
    mail = lines[1].replace("\n", "")
    password = lines[2].replace("\n", "")


    find_xpath('//input[@placeholder="Username"]').send_keys(username)
    find_xpath('//input[@placeholder="Email"]').send_keys(mail)
    find_xpath('//input[@placeholder="Password"]').send_keys(password)

    find_xpath('//button[@class="btn btn-lg btn-primary pull-xs-right"]').click()
    time.sleep(2)
    find_xpath('//button[@class="swal-button swal-button--confirm"]').click()
    time.sleep(2)
    logedin_user = driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[4]/a').text

    assert username == logedin_user
    driver.close()

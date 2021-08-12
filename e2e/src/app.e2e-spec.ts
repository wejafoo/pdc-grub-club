

import { browser					} from 'protractor';
import { element					} from 'protractor';
import { by							} from 'protractor';
import { ExpectedConditions as EC	} from 'protractor';

const numDashboardTabs	= 5;
const numPlans			= 4;
const numPresbies		= 10;

describe('Router', () => {
	
	beforeAll(() => browser.get(''));
	
	function getPageStruct() {
		const hrefEles		= element.all( by.css( 'nav a'));
		const planDetail	= element.all( by.css( 'app-planning-center > app-plan-list > app-plan-detail > div' )).first();
		const presbyDetail	= element( by.css( 'app-presby-detail'));
		
		return {
			hrefs:					hrefEles,
			activeHref:				element( by.css( 'nav a.active' )),
			planHref:				hrefEles.get( 0 ),
			planList:				element.all( by.css( 'app-planning-center app-plan-list li')),
			planDetail,
			planDetailTitle:		planDetail.element( by.xpath('*[1]')),
			presbiesHref:			hrefEles.get( 1 ),
			presbiesList:			element.all( by.css( 'app-presby-list li' )),
			presbyDetail,
			presbyDetailTitle:		presbyDetail.element( by.xpath( '*[2]' )),
			adminHref:				hrefEles.get( 2 ),
			adminPage:				element( by.css( 'app-admin')),
			adminPreloadList:		element.all( by.css( 'app-admin > app-admin-dashboard > ul > li')),
			loginHref:				hrefEles.get( 3 ),
			loginButton:			element.all( by.css( 'app-login > p > button'	)),
			contactHref:			hrefEles.get( 4 ),
			contactCancelButton:	element.all( by.buttonText('Cancel'	)),
			primaryOutlet:			element.all( by.css( 'app-presby-list'			)),
			secondaryOutlet:		element.all( by.css( 'app-compose-message' 		))
		};
	}
	
	it('has expected dashboard tabs', async () => {
		const page = getPageStruct();
		expect( await page.hrefs.count()).toEqual(numDashboardTabs, 'dashboard tab count');
		expect( await page.planHref.getText()).toEqual('Planning Center'	);
		expect( await page.presbiesHref.getText()).toEqual('Presbies'		);
		expect( await page.adminHref.getText()).toEqual('Admin'			);
		expect( await page.loginHref.getText()).toEqual('Login'			);
		expect( await page.contactHref.getText()).toEqual('Contact'		);
	});
	
	it('has presbies selected as opening tab', async () => {
		const page = getPageStruct();
		expect( await page.activeHref.getText()).toEqual('Presbies' );
	});
	
	it('has planning center items', async () => {
		const page = getPageStruct();
		await page.planHref.click();
		expect( await page.activeHref.getText()).toEqual('Planning Center' );
		expect( await page.planList.count()).toBe( numPlans, 'plan list count' );
	});
	
	it('has presby items', async () => {
		const page = getPageStruct();
		await page.presbiesHref.click();
		expect( await page.activeHref.getText()).toEqual('Presbies');
		expect( await page.presbiesList.count()).toBe(numPresbies, 'presby list count');
	});
	
	it('toggles views', async () => {
		const page = getPageStruct();
		await page.planHref.click();
		expect( await page.activeHref.getText()).toEqual('Planning Center' );
		expect( await page.planList.count()).toBe( numPlans, 'plan list count' );
		await page.presbiesHref.click();
		expect( await page.activeHref.getText()).toEqual('Presbies' );
		expect( await page.presbiesList.count()).toBe( numPresbies, 'presby list count' );
	});
	
	it('saves changed plan details', async () => {
		const page = getPageStruct();
		await page.planHref.click();
		await planningCenterEdit( 2, true );
	});
	
	// TODO: Figure out why this test is failing now
	xit('can cancel changed plan details', async () => {
		const page = getPageStruct();
		await page.planHref.click();
		await planningCenterEdit( 3, false );
	});
	
	it('saves changed presby details', async () => {
		const page		= getPageStruct();
		await page.presbiesHref.click();
		await browser.sleep(600 );
		
		const presbyEle	= page.presbiesList.get( 4 );
		const text		= await presbyEle.getText();
		expect( text.length ).toBeGreaterThan(0, 'presby item text length' );
		
		const presbyText = text.substr( text.indexOf( ' ' )).trim();													// remove leading id from text
		await presbyEle.click();
		await browser.sleep(600 );
		expect( await page.presbiesList.count()).toBe(0, 'presby list count' );
		expect( await page.presbyDetail.isPresent()).toBe(true, 'presby detail' );
		expect( await page.presbyDetailTitle.getText()).toContain( presbyText );
		
		const inputEle = page.presbyDetail.element( by.css( 'input' ));
		await inputEle.sendKeys('-foo');
		expect( await page.presbyDetailTitle.getText()).toContain(presbyText + '-foo' );
		
		const buttonEle = page.presbyDetail.element( by.css( 'button' ));
		await buttonEle.click();
		await browser.sleep(600);
		expect( await presbyEle.getText()).toContain(presbyText + '-foo' );
	});
	
	it('sees preloaded modules', async () => {
		const page = getPageStruct();
		await page.loginHref.click();
		await page.loginButton.click();
		const list = page.adminPreloadList;
		expect( await list.count()).toBe(1, 'preloaded module' );
		expect( await list.first().getText()).toBe('planning-center', 'first preloaded module' );
	});
	
	it('sees the secondary route', async () => {
		const page = getPageStruct();
		await page.presbiesHref.click();
		await page.contactHref.click();
		expect( await page.primaryOutlet.count()	).toBe(1, 'primary outlet'	);
		expect( await page.secondaryOutlet.count()	).toBe(1, 'secondary outlet');
	});
	
	it('should redirect with secondary route', async () => {
		const page = getPageStruct();
		await browser.get('');																				// go to login page and login
		await page.loginHref.click();
		await page.loginButton.click();
		await page.contactHref.click();																					// open secondary outlet
		await page.loginHref.click();																					// go to login page and logout
		await page.loginButton.click();
		await page.adminHref.click();																					// attempt to go to admin page, redirects to login with secondary outlet open
		await page.loginButton.click();																					// login, get redirected back to admin with outlet still open
		expect( await page.adminPage.isDisplayed()).toBeTruthy();
		expect( await page.secondaryOutlet.count()).toBeTruthy()
	});
	
	async function planningCenterEdit( index: number, save: boolean ) {
		const page = getPageStruct();
		await page.planHref.click();
		let planEle	= page.planList.get( index );
		const text	= await planEle.getText();
		expect( text.length ).toBeGreaterThan(0, 'plan item text length' );
		// remove leading id from text
		const planText = text.substr( text.indexOf( ' ' )).trim();
		
		await planEle.click();
		expect( await page.planDetail.isPresent()).toBe(true, 'plan detail present' );
		expect( await page.planDetailTitle.getText()).toContain( planText );
		const inputEle = page.planDetail.element( by.css( 'input' ));
		await inputEle.sendKeys( '-foo' );
		
		const buttonEle = page.planDetail.element( by.buttonText(save ? 'Save' : 'Cancel' ));
		await buttonEle.click();
		planEle = page.planList.get( index );
		if ( save ) {
			expect( await planEle.getText()).toContain(planText + '-foo' );
		} else {
			await browser.wait( EC.alertIsPresent(), 4000 );
			await browser.switchTo().alert().accept();
			expect( await planEle.getText()).toContain( planText );
		}
	}
	
});

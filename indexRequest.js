const path = require("path");

const request = require('request');
const cheerio = require('cheerio');


const REQUEST_BASE_URL = "https://www.iaai.com/";


const removeSpacesHyphens = (str) => (str).replace(/\s{5,}/g, ';')

const parseJsonToObject = (str) => {
	try {
		const obj = JSON.parse(str);
		return obj;
	} catch(e) {
		return {};
	}
};

/**
 * @param url string
 * @returns {Promise<any>}
 */
function getPage(url) {
	return new Promise((resolve, reject) => {
		request({
			url: url,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
			}
		}, (error, response, body) => {
			if (error) return reject(error);
			
			//Add "decodeEntities" flag to avoid decoding entities and be able to search by selectors
			return resolve(cheerio.load(body
				, { decodeEntities: false }
			));
		});
	});
}


/**
 * parse auction page
 *
 * @return {Promise<[{},{}]>}
 *
 * @example [{
  branch: 'San Diego',
  auctionTime: '11:30am',
  closeTime: '2d 5h',
  auctionLink: 'Auctions/BranchListingView.aspx?branchCode=116&aucDate=01252021'
	}, {}..]
 */
function auctionPage () {
	const urlRequest = REQUEST_BASE_URL + "LiveAuctionsCalendar";
	
	return getPage(urlRequest)
		.then($ => {
			const tableRows = $("#dvListLiveAuctions .table-row.table-row-border")
			const auctionsCalendar = [];
			
			const getDataPage = (index, tableRow) => {
				const row = $(tableRow)
				const tableCells = row.find('.table-cell > .data-list--block');
				const liTextsName = tableCells.find('li:nth-child(1)').text()
				
				const tableStatus = row.find('div.table-cell.table-cell--status.table-cell-horizontal-center');
				const auctionLink = tableStatus.find('a').attr("href");
				const spanCloseTime = tableStatus.find('.data-list__value').text();
				
				const withoutSpacesName = removeSpacesHyphens(liTextsName);
				const splitTextName = withoutSpacesName.split(";")
				const auctionTime = (splitTextName[ 2 ].length > 5) ? splitTextName[ 2 ].slice(0, -6) : "0"; // 11:30am (CST) => 11:30am
				
				const withoutSpacesCloseTime = removeSpacesHyphens(spanCloseTime);
				const splitTextCloseTime = withoutSpacesCloseTime.split(";")
				const closeTime = (splitTextCloseTime[ 1 ].length > 5) ? splitTextCloseTime[ 1 ].substr(19) : "0"; // Pre-Bid Closes In: 2d 5h => 2d 5h
				
				const dataTemplate = {
					"branch": splitTextName[ 1 ],
					"auctionTime": auctionTime,
					"closeTime": closeTime,
					"auctionLink": auctionLink
				}
				
				auctionsCalendar.push(dataTemplate)
			}
			
			tableRows.each(getDataPage)
			
			return auctionsCalendar
		})
}
// auctionPage()
// 		.then(auctionCalendarList => console.log(auctionCalendarList))
// 		.catch(err => { throw err });

const exampleAuctionPage = {
	branch: 'San Diego',
	auctionTime: '11:30am',
	closeTime: '2d 5h',
	auctionLink: 'Auctions/BranchListingView.aspx?branchCode=116&aucDate=01252021'
}

/********************************************************/

/**
 * Parse sale list page
 *
 * @param url  string  Auctions/BranchListingView.aspx?branchCode=116&aucDate=01252021
 * @return {Promise<[{},{}]>}
 *
 * @example [{
		stockText: '29291905',
		yearText: '2010',
		vinText: 'JN1AJ0HP5AM******'
	}, {}...]
 */
function saleListPage(url = "") {
	const getUrlAuctionData = url.match(/[branchCode|aucDate]=(\d{3,})/g, ).map((elem) => elem.substr(2));
	const urlPathTemplate = REQUEST_BASE_URL + path.join("SalesList", getUrlAuctionData[ 0 ], getUrlAuctionData[ 1 ]);
	
	return getPage(urlPathTemplate)
		.then($ => {
			const tableRows = $("#salesListLoader > tbody > tr")
			const listPageCollection = [];
			
			const getDataSalePage = (index, tableRow) => {
				
				const stockRow = $(tableRow).find("td:nth-child(4)")
				const stockText = stockRow.text().trim();
				
				const yearRow = $(tableRow).find("td:nth-child(7)")
				const yearText = yearRow.text().trim();
				
				const vinRow = $(tableRow).find("td:nth-child(12)")
				const vinText = vinRow.text().trim();
				
				const imgRow = $(tableRow).find(".img-responsive > img")
				const imgSrc = imgRow.attr("data-original");
				const imgBig = imgSrc.replace(/width=160&height=120/, "width=845&height=633");
				
				const dataTemplate = {
					"stockText" : stockText,
					"yearText" : yearText,
					"vinText" : vinText,
					"imgBig" : imgBig
				}
				
				if (yearText > 2009) {
					listPageCollection.push(dataTemplate)
				}
			};
			
			tableRows.each(getDataSalePage)
			
			return listPageCollection;
		})
}

// saleListPage(exampleAuctionPage.auctionLink)
// 		.then(saleList => console.log(saleList))
// 		.catch(err => { throw err });

const exampleSaleListPage = {
	stockText: '29291905',
	yearText: '2010',
	vinText: 'JN1AJ0HP5AM******'
}
/********************************************************/
/**
 * Parse details page
 *
 * @param carNumber string "38768182"
 * @return  boolean true/false
 */
function detailsPage(carNumber = "") {
	const urlPathTemplate = REQUEST_BASE_URL + path.join("vehicledetails", carNumber);
	
	return getPage(urlPathTemplate)
		.then($ => {
			const scriptBlock = $("#ProductDetailsVM")
			const textToObject = parseJsonToObject(scriptBlock.html());
			
			return textToObject.VehicleDetailsViewModel.BuyNowInd
		})
}

// detailsPage(exampleSaleListPage.stockText)
// detailsPage("38768182")
// 		.then(saleList => console.log("BuyNowInd :",saleList))
// 		.catch(err => { throw err });




auctionPage()
	.then((auctionCalendarList) => {
		let counter = 0;
		
		const res = Promise.all(
			auctionCalendarList.map((calendar, indexI) => {
				counter += indexI;
				
				return saleListPage(calendar.auctionLink)
					.catch(err => { throw err });
			})
		)
		
		console.log("Количество запросов", counter)
		
		return res
	})
	.then(res => console.info("DONE!"))
	.catch(err => { throw err });


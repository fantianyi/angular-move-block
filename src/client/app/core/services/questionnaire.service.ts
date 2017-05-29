import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, Jsonp, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { QuestionnaireModel } from '../../shared/models/questionnaire.model';
import { SITE_HOST_URL, BTCE_REST_URL } from '../../shared/index';
import { TickerModel } from '../../shared/models/ticker.model';

@Injectable()
export class QuestionnaireService {

	constructor(private http:Http, private jsonp:Jsonp) { }

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'server error');
	}

	//根据id获取问卷信息
	getQuestionnaireById(id: string) {
		return this.http.get(SITE_HOST_URL + 'questionnaire/' + id)
                    .map(res => <QuestionnaireModel>res.json().data)
                    .catch(this.handleError);
	}
	
	// Method ticker
    // This method provides all the information about currently active pairs, such as: the maximum price, the minimum price, average price, trade volume, trade volume in currency, the last trade, Buy and Sell price.
    // All information is provided over the past 24 hours.
	//根据id获取问卷信息
	getTicker(id: string) {
		//try{
			
		let headers = new Headers({
			// "origin": BTCE_REST_URL,
			// "referer":BTCE_REST_URL
			//"Content-Type": "application/javascript"
		});
		// let params = new URLSearchParams();
		// params.set('format', 'json');
		// params.set('callback', 'JSONP_CALLBACK');
		//headers.append("origin", BTCE_REST_URL);
		let options = new RequestOptions({ headers: headers });
		return this.http.get(BTCE_REST_URL + 'ticker/' + id, options)
                    .map(res => <TickerModel>res.json()[id])
                    .catch(this.handleError);

		// }
		// catch(e) {
		// 	console.error(e)
		// 	return this.handleError
		// }
	}

	getQuestionnaires() {
		return this.http.get(SITE_HOST_URL + 'questionnaires')
						.map(res => <QuestionnaireModel[]>res.json().data)
						.catch(this.handleError);
	}

	//添加新问卷
	addQuestionnaire(questionnaire:QuestionnaireModel) {
		let body = JSON.stringify(questionnaire);
		let headers = new Headers({'Content-Type':'application/json'});
		let options = new RequestOptions({headers:headers});

		return this.http.post(SITE_HOST_URL + 'questionnaire/add', body, options)
					.map(res => <QuestionnaireModel>res.json().data)
					.catch(this.handleError);	
	}
    
	//删除已有问卷
	deleteQuestionnaire(id: string) {
		return this.http.get(SITE_HOST_URL + 'questionnaire/delete/' + id)
					.map(res => <Object>res.json().data)
					.catch(this.handleError);
	}

	//更新已有问卷
	updateQuestionnaire(questionnaire:QuestionnaireModel) {
		let body = JSON.stringify(questionnaire);
		let headers = new Headers({'Content-Type':'application/json'});
		let options = new RequestOptions({headers:headers});

		return this.http.post(SITE_HOST_URL + 'questionnaire/update', body, options)
		.map(res => <QuestionnaireModel>res.json().data)
		.catch(this.handleError);
	}

	//发布问卷
	publishQuestionnaire(id: string){
		return this.http.get(SITE_HOST_URL + 'questionnaire/publish/' + id)
					.map(res => <QuestionnaireModel>res.json().data)
					.catch(this.handleError);
	}

	//回收问卷
	reclaimQuestionnaire(questionnaire:QuestionnaireModel) { }

}
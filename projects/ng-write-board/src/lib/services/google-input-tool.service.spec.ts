import { inject, TestBed } from '@angular/core/testing';

import { GoogleInputToolService } from './google-input-tool.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Language } from '../writeboard/language';

describe('GoogleInputToolService', () => {
  let httpTestingController: HttpTestingController;
  let googleInputToolservice: GoogleInputToolService;
  const baseUrl =  "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8";
  const dummyTrace = [
    [
        101,
        103,
        112,
        126,
        145,
        177,
        197,
        208,
        210,
        218,
        226,
        229,
        232,
        235,
        237,
        241,
        242,
        243,
        243,
        244,
        249,
        252,
        258,
        268,
        269,
        272
    ],
    [
        191.4821319580078,
        191.4821319580078,
        193.4821319580078,
        193.4821319580078,
        192.4821319580078,
        184.4821319580078,
        176.4821319580078,
        173.4821319580078,
        172.4821319580078,
        170.4821319580078,
        170.4821319580078,
        170.4821319580078,
        170.4821319580078,
        170.4821319580078,
        170.4821319580078,
        170.4821319580078,
        170.4821319580078,
        170.4821319580078,
        169.4821319580078,
        169.4821319580078,
        169.4821319580078,
        169.4821319580078,
        169.4821319580078,
        169.4821319580078,
        169.4821319580078,
        169.4821319580078
    ],
    []
];
  const dummyNormalResponse = {
    "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
    },
    "status": 200,
    "statusText": "OK",
    "url": "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
    "ok": true,
    "type": 4,
    "body": [
        "SUCCESS",
        [
            [
                "b256565cff0d059f",
                [
                    "大",
                    "太",
                    "大人",
                    "人",
                    "大一",
                    "火",
                    "犬",
                    "丈",
                    "天",
                    "夫"
                ],
                [],
                {
                    "is_html_escaped": false
                }
            ]
        ]
    ]
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(inject(
    [GoogleInputToolService],
    (service: GoogleInputToolService) => {
      googleInputToolservice = service;
    }
  ));
  it('should be created', () => {
    expect(googleInputToolservice).toBeTruthy();
  });
  
  it('Given valid trace, when call recognize(), then HTTP 200 with data responsed.', () => {
    googleInputToolservice.recognize(dummyTrace, Language.ChineseTraditional).subscribe((r: any) => {
      expect(r).toEqual(expectedResponse);
    });
    let expectedResponse = httpTestingController.expectOne({
      url: baseUrl,
      method: "POST"
    });
    expectedResponse.event(dummyNormalResponse);
  });
});

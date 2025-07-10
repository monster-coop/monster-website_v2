토스페이먼츠 초기화
TossPayments() 메서드로 SDK를 초기화해주세요. 반환되는 객체로 토스페이먼츠 SDK의 모든 결제 서비스를 이용할 수 있어요. 내 상점의 클라이언트 키를 파라미터로 넣으면 토스페이먼츠에서 상점의 정보를 확인할 수 있어요. 사용하고 싶은 제품에 따라 필요한 클라이언트 키 종류가 다른데요. 키 종류, 테스트 및 라이브 키 정보는 API 키 가이드에서 자세히 확인하세요.

// 스크립트 태그 연동방식
const tossPayments = TossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"); // 결제위젯 연동 키
const tossPayments = TossPayments("test_ck_Poxy1XQL8R17pblNnqwlr7nO5Wml");  // API 개별 연동 키

// 모듈 임포트 연동방식
import { loadTossPayments } from "@tosspayments/tosspayments-sdk"
const tossPayments = await loadTossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");
파라미터
clientKey 필수 · string
토스페이먼츠 발급하는 클라이언트 키입니다. 개발자센터의 API 키 메뉴에서 확인할 수 있어요.

결제위젯을 연동한다면 결제위젯 연동 키를 사용하세요. 브랜드페이, 결제창, 자동결제(빌링)를 연동한다면 API 개별 연동 키를 사용하세요.

응답
아래 메서드를 호출할 수 있는 토스페이먼츠 객체를 반환합니다.

TossPaymentsSDK
widgets function
결제위젯을 초기화합니다. 자세히 >

brandpay function
브랜드페이를 초기화합니다. 자세히 >

payment function
결제창을 초기화합니다. 자세히 >

결제위젯
tossPayments.widgets()
결제위젯을 초기화합니다. 결제위젯은 토스페이먼츠만의 기본 결제 서비스로, 수많은 상점을 분석해서 만든 최적의 주문서 결제 UI예요.

// 회원 결제
const widgets = tossPayments.widgets({ customerKey });

// 비회원 결제
// 스크립트 태그 연동방식
const widgets = tossPayments.widgets({ customerKey: TossPayments.ANONYMOUS });
// 모듈 임포트 연동방식
import { ANONYMOUS } from "@tosspayments/tosspayments-sdk";
const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
파라미터
params 필수 · object
결제위젯 초기화 정보입니다.

customerKey 필수 · string
구매자를 식별하는 고유 아이디입니다.

이메일・전화번호나 자동 증가하는 숫자와 같이 유추가 가능한 값은 안전하지 않아요. UUID와 같이 충분히 무작위적인 고유 값으로 생성해주세요. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 중 최소 1개를 포함하는 최소 2자 이상 최대 50자 이하의 문자열이어야 합니다.

brandpay object
결제위젯으로 브랜드페이로 연동할 때 필요한 정보입니다.

redirectUrl string
브랜드페이 결제 과정에서 Access Token 발급을 위해 필요한 URL입니다. Access Token은 브랜드페이 고객을 식별하고 고객의 결제 권한을 증명합니다. 값을 넣지 않으면 개발자센터의 브랜드페이 메뉴에 최초로 등록한 리다이렉트 URL이 기본값으로 들어갑니다.

* 브랜드페이 메뉴에 두 개 이상의 리다이렉트 URL을 등록한 상점은 각 도메인에 맞는 redirectUrl 값을 필수로 추가하세요.

응답
아래 메서드를 호출할 수 있는 결제위젯 객체를 반환합니다.

TossPaymentsWidgets
setAmount function
주문의 결제 금액을 설정합니다. 자세히 >

renderPaymentMethods function
결제 UI를 렌더링합니다. 자세히 >

requestPayment function
결제를 요청합니다. 구매자가 결제 UI에서 선택한 결제수단의 결제창을 띄워요. 자세히 >

renderAgreement function
약관 UI를 렌더링합니다. 자세히 >

widgets.setAmount()
결제 금액을 설정합니다. 결제 UI를 렌더하는 renderPaymentMethods() 메서드를 호출하기 전에 반드시 금액을 설정해주세요. 만약에 쿠폰, 할인 등으로 인해 주문서에서 결제 금액이 바뀌면 setAmount()로 결제 금액을 업데이트해주세요.

widgets.setAmount({
  currency: 'KRW',
  value: amount,
});
파라미터
amount 필수 · object
결제 금액 정보입니다.

value 필수 · number
결제 금액입니다.

currency 필수 · string
결제 통화입니다. 일반결제는 KRW만 지원합니다. 해외 간편결제(PayPal)는 USD만 지원합니다.

응답
Promise<void>
widgets.renderPaymentMethods()
결제 UI를 렌더링합니다. 주문서의 DOM이 생성된 이후에 호출하세요. 토스페이먼츠와 전자결제 계약을 완료했다면 결제위젯 어드민에서 결제수단, 디자인 등 결제 UI를 커스터마이징할 수 있어요.

const paymentMethodWidget = await widgets.renderPaymentMethods({
  selector: "#payment-method",
  variantKey: "CUSTOM-1"
});
파라미터
params 필수 · object
결제 UI 렌더링 정보입니다.

selector 필수 · string
결제 UI를 렌더링할 위치를 지정합니다. <div>와 같은 HTML 요소를 선택할 수 있는 CSS 선택자를 사용합니다. 예를 들어 <div id="payment-method">에 결제 UI를 렌더링하려면, #payment-method를 전달해야 합니다.

variantKey string
렌더링하고 싶은 결제 UI의 variantKey입니다. 2개 이상의 결제 UI를 사용하고 있다면 설정해주세요. variantKey는 상점관리자의 결제위젯 어드민에서 확인할 수 있어요. 기본 값은 DEFAULT입니다.

응답
반환되는 결제 UI 객체로 아래 메서드를 호출할 수 있어요.

Promise<WidgetPaymentMethodWidget>
on function
결제 UI의 이벤트를 구독합니다. 자세히 >

getSelectedPaymentMethod function
구매자가 선택한 결제수단을 불러옵니다. 자세히 >

destroy function
결제 UI 객체를 제거합니다. 자세히 >

paymentMethodWidget.getSelectedPaymentMethod()
구매자가 결제 UI에서 현재 선택한 결제수단을 불러옵니다.

const paymentMethod = await paymentMethodWidget.getSelectedPaymentMethod();
응답
Promise<WidgetSelectedPaymentMethod>
paymentMethodWidget.on()
결제 UI 이벤트를 구독합니다. 현재 지원하는 이벤트는 paymentMethodSelect입니다.

paymentMethodWidget.on('paymentMethodSelect', selectedPaymentMethod => {
  if (selectedPaymentMethod.code === '카드') {
    // 카드 안내사항 노출
  }
  if (selectedPaymentMethod.code === '문화바우처') {
    // 커스텀 결제수단 (결제위젯 Pro 플랜 기능)
    // 문화바우처 안내사항 노출
  }
});
파라미터
eventName 필수 · "paymentMethodSelect"
구독할 이벤트입니다. paymentMethodSelect 이벤트로 구매자가 선택한 결제수단 코드를 확인하세요. 일반결제는 결제수단 ENUM 코드가 응답돼요. 결제위젯 Pro 플랜으로 커스텀 결제수단을 연동했다면 결제위젯 어드민에서 설정한 key 값이 응답돼요.

callback 필수 · function
이벤트가 일어나면 호출되는 콜백 함수입니다.

응답
void
paymentMethodWidget.destroy()
renderPaymentMethods()로 생성한 결제 UI 객체를 제거합니다. 한 페이지에서 두 개의 결제 UI를 렌더링할 수 없어요. 새로운 결제 UI를 렌더링하고 싶다면 destroy() 메서드로 기존 결제 UI를 제거한 다음에 렌더링하세요.

await paymentMethodWidget.destroy();
응답
Promise<void>
widgets.requestPayment()
결제를 요청합니다. 구매자가 결제 UI에서 선택한 결제수단의 결제창을 띄워요. 결제 버튼은 직접 만들어주세요.

결제위젯의 결제 요청은 Redirect 방식과 Promise 방식을 지원하고 있어요. 결제 요청이 끝나고 결과를 확인하는 방법의 차이인데요. Redirect 방식을 선택하면 파라미터로 설정한 successUrl 또는 failUrl로 결제 요청의 결과를 확인할 수 있어요. Promise 방식을 선택하면 Promise로 돌아오는 객체로 결과를 확인할 수 있지만, Promise 방식은 모바일 환경에서 사용할 수 없어요.


Redirect 방식

widgets.requestPayment({
  orderId: generateRandomString(),
  orderName: "토스 티셔츠 외 2건",
  successUrl: window.location.origin + "/success.html",
  failUrl: window.location.origin + "/fail.html",
  customerEmail: "customer123@gmail.com",
  customerName: "김토스",
});
파라미터
paymentRequest 필수 · object
결제 요청 정보입니다.

orderId 필수 · string
주문번호입니다. 각 주문을 구분하는 무작위한 고유값을 생성하세요. 영문 대소문자, 숫자, 특수문자 -, _, =로 이루어진 6자 이상 64자 이하의 문자열이어야 합니다.

orderName 필수 · string
구매상품입니다. 예를 들면 생수 외 1건 같은 형식입니다. 최대 길이는 100자입니다.

customerEmail string
구매자 이메일입니다. 결제 상태가 바뀌면 이메일 주소로 결제내역이 전송됩니다. 최대 길이는 100자입니다.

customerName string
구매자명입니다. 최대 길이는 100자입니다.

customerMobilePhone string
구매자의 휴대폰 번호입니다. 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되고 있어요. - 없이 숫자로만 구성된 최소 8자, 최대 15자의 문자열입니다.

taxFreeAmount number
결제 금액 중 면세 금액입니다. 면세 상점 혹은 복합 과세 상점으로 계약된 상점만 사용하세요. 자세한 내용은 세금 처리 가이드에서 확인하세요.

windowTarget enum
브라우저에서 결제창이 열리는 프레임입니다. self, iframe 중 하나입니다.

- self는 현재 브라우저를 결제창으로 이동시켜요. 모바일 환경에서 기본 값입니다.

- iframe은 iframe에서 결제창이 열려요. PC 환경에서 기본 값입니다. 모바일 환경에서는 iframe을 사용할 수 없습니다.

metadata object
결제 관련 정보를 추가할 수 있는 객체입니다. 최대 5개의 키-값(key-value) 쌍을 자유롭게 추가해주세요. 키는 [ , ] 를 사용하지 않는 최대 40자의 문자열, 값은 최대 500자의 문자열입니다.

card object
구매자가 카드를 선택하면 결제에 적용되는 옵션입니다.

taxExemptionAmount number
과세를 제외한 결제 금액(컵 보증금 등)입니다. 값을 넣지 않으면 기본값인 0으로 설정됩니다. 과세 제외 금액이 있는 카드 결제는 부분 취소가 안 됩니다.

appScheme string
페이북/ISP 앱에서 상점 앱으로 돌아올 때 사용됩니다. 상점의 앱 스킴을 지정하면 됩니다. 예를 들면 testapp://같은 형태입니다.

transfer object
구매자가 계좌이체를 선택하면 결제에 적용되는 옵션입니다.

useEscrow boolean
에스크로 적용 여부입니다. true로 설정하면 구매자가 반드시 에스크로 적용에 동의해야 결제가 완료돼요. false로 설정하거나 파라미터를 설정하지 않으면 에스크로 적용을 구매자 선택에 맡겨요.

escrowProducts array
각 상품의 상세 정보 객체를 담는 배열입니다. 에스크로를 사용하는 상점이라면 필수 파라미터입니다. 예를 들어 사용자가 세 가지 종류의 상품을 구매했다면 길이가 3인 배열이어야 합니다.

id string
각 상품의 고유 ID입니다.

name string
상품명입니다.

code string
내 상점에서 사용하는 상품 관리 코드입니다.

unitPrice number
상품의 1개의 개별 가격입니다.

quantity number
상품 구매 수량입니다.

virtualAccount object
구매자가 가상계좌를 선택하면 결제에 적용되는 옵션입니다.

useEscrow boolean
에스크로 사용 여부입니다. 값을 주지 않으면 결제창에서 고객이 직접 에스크로 결제 여부를 선택합니다.

escrowProducts array
각 상품의 상세 정보 객체를 담는 배열입니다. 에스크로를 사용하는 상점이라면 필수 파라미터입니다. 예를 들어 사용자가 세 가지 종류의 상품을 구매했다면 길이가 3인 배열이어야 합니다.

id string
각 상품의 고유 ID입니다.

name string
상품명입니다.

code string
내 상점에서 사용하는 상품 관리 코드입니다.

unitPrice number
상품의 1개의 개별 가격입니다.

quantity number
상품 구매 수량입니다.

cashReceipt object
현금영수증 정보입니다.

type 필수 · enum
현금영수증 발급 용도입니다. '소득공제', '지출증빙', '미발행' 중 하나입니다.

foreignEasyPay object
구매자가 해외간편결제를 선택하면 결제에 적용되는 옵션입니다.

country 필수 · string
구매자가 위치한 국가입니다. ISO-3166의 두 자리 국가 코드를 입력하세요.

products array
구매 상품 정보입니다. 여러 가지의 상품을 결제했다면 각 상품의 정보를 입력하세요. 예를 들어, 구매자가 세 가지 종류의 상품을 구매했다면 배열의 길이는 3이어야 합니다.

PayPal에서 제공하는 판매자 보호를 받고 싶다면 반드시 해당 파라미터를 사용하세요. 판매자 보호 및 위험거래 관리를 위해 PayPal에 제공돼요.

name 필수 · string
상품명입니다.

quantity 필수 · number
상품의 구매 수량입니다.

unitAmount 필수 · number
상품의 1개의 개별 가격입니다.

currency 필수 · string
결제 통화입니다.

description 필수 · string
상품 설명입니다.

shipping object
배송 정보입니다.

fullName string
수령인입니다.

address object
배송 주소입니다.

country 필수 · string
구매자가 위치한 국가입니다. ISO-3166의 두 자리 국가 코드를 입력하세요.

line1 string
주소입니다. 도로명 및 건물(Street, Apt), 번지 정보입니다.

line2 string
상세 주소입니다. 번지 및 동호수 정보를 입력하세요.

area1 string
주(State, Province, Region) 정보입니다. 국가의 도시 체계에 따라 없는 경우가 있습니다.

area2 필수 · string
도시입니다.

postalCode string
배송지 우편번호입니다. 중국, 일본, 프랑스, 독일 등 일부 국가에서는 필수 파라미터입니다

paymentMethodOptions object
특정 해외간편결제 수단에만 필요한 정보입니다.

paypal object
PayPal 결제에 추가로 필요한 정보입니다.

setTransactionContext unknown
PayPal에서 추가로 요청하는 STC(Set Transaction Context) 정보입니다. 이 정보는 토스페이먼츠에서 관리하지 않으며, PayPal에서 부정거래, 결제 취소, 환불 등 리스크 관리에 활용합니다. 결제 거래의 안전성과 신뢰성을 확보하려면 이 정보를 전달해야 합니다. PayPal STC 문서를 참고해서 업종에 따라 필요한 파라미터를 추가해주세요. 문서의 표에 있는 ‘Data Field Name’ 컬럼 값을 객체의 ‘key’로, ‘Description’에 맞는 값을 객체의 ‘value’로 넣어주시면 됩니다.

successUrl string
결제 요청이 성공하면 리다이렉트되는 URL입니다. https://www.example.com/success와 같이 오리진을 포함한 형태로 설정해주세요. 리다이렉트되면 URL의 쿼리 파라미터로 amount, orderId, paymentKey가 추가돼요.

failUrl string
결제 요청이 실패하면 리다이렉트되는 URL입니다. https://www.example.com/fail와 같이 오리진을 포함한 형태로 설정해주세요. 리다이렉트되면 URL의 쿼리 파라미터로 에러 코드와 메시지를 확인할 수 있어요.

응답
결제 요청이 성공하면 파라미터로 설정한 successUrl로 이동해요. 쿼리 파라미터의 amount 값이 메서드 파라미터로 설정한 amount와 같은지 반드시 확인하고 결제 승인 API를 호출해서 결제를 완료하세요.

{successUrl}?paymentType={PAYMENT_TYPE}&amount={AMOUNT}&orderId={ORDER_ID}&paymentKey={PAYMENT_KEY}
결제 요청이 실패하면 파라미터로 설정한 failUrl로 이동해요. 쿼리 파라미터로 에러 코드와 메시지를 확인하세요.

{failUrl}?code={ERROR_CODE}&message={ERROR_MESSAGE}&orderId={ORDER_ID}
Redirect 방식에서는 URL이 이동하기 때문에 void가 응답됩니다.

Promise<void>
widgets.renderAgreement()
약관 UI를 렌더합니다. 약관에는 기본 토스페이먼츠 이용약관이 있는데요. 내 상점만의 약관을 추가하거나 다른 언어로 약관을 추가하고 싶다면 결제위젯 어드민에서 수정해주세요.

const agreementWidget = await widgets.renderAgreement({
  selector: "#agreement",
  variantKey: "AGREEMENT"
});
파라미터
params 필수 · object
약관 UI 렌더링 정보입니다.

selector 필수 · string
약관 UI를 렌더링할 위치를 지정합니다. <div>와 같은 HTML 요소를 선택할 수 있는 CSS 선택자를 사용합니다. 예를 들어 <div id="agreement">에 결제 UI를 렌더링하려면, #agreement를 전달해야 합니다.

variantKey string
렌더링하고 싶은 약관 UI의 variantKey입니다. 상점관리자의 결제위젯 어드민에서 확인할 수 있어요.

응답
반환되는 약관 UI 객체로 아래 메서드를 호출할 수 있어요.

Promise<WidgetAgreementWidget>
on function
약관 UI의 이벤트를 구독합니다. 자세히

destroy function
약관 UI 객체를 제거합니다. 자세히 >

agreementWidget.on()
약관 UI 이벤트를 구독합니다. 현재 지원하는 이벤트는 agreementStatusChange입니다.

agreementWidget.on('agreementStatusChange', agreementStatus => {
  if (agreementStatus.agreedRequiredTerms) {
    // 결제 버튼 활성화
  } else {
    // 결제 버튼 비활성화
  }
});
파라미터
eventName 필수 · "agreementStatusChange"
구독할 이벤트입니다. agreementStatusChange 이벤트로 구매자가 약관에 동의했는지 확인하세요.

callback 필수 · function
이벤트가 일어나면 호출되는 콜백 함수입니다.

응답
void
agreementWidget.destroy()
renderAgreement() 메서드로 생성한 약관 UI를 객체를 파괴합니다. 한 페이지에서 두 개의 약관 UI를 렌더링할 수 없어요. 새로운 약관 UI를 렌더링하고 싶다면 destroy() 메서드로 기존 약관 UI를 제거한 다음에 렌더링하세요.

await agreementWidget.destroy();
응답
Promise<void>
브랜드페이
tossPayments.brandpay()
브랜드페이를 초기화합니다. 브랜드페이는 내 상점의 자체 간편결제를 쉽게 만들 수 있는 결제 서비스예요.

const brandpay = tossPayments.brandpay({
  customerKey,
  redirectUrl: window.location.origin + '/callback-auth',
});
파라미터
params 필수 · object
브랜드페이 초기화 정보입니다.

customerKey 필수 · string
구매자를 식별하는 고유 아이디입니다.

이메일・전화번호나 자동 증가하는 숫자와 같이 유추가 가능한 값은 안전하지 않아요. UUID와 같이 충분히 무작위적인 고유 값으로 생성해주세요. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 중 최소 1개를 포함하는 최소 2자 이상 최대 50자 이하의 문자열이어야 합니다.

redirectUrl string
브랜드페이 결제 과정에서 Access Token 발급을 위해 필요한 URL입니다. Access Token은 브랜드페이 고객을 식별하고 고객의 결제 권한을 증명합니다. 값을 넣지 않으면 개발자센터의 브랜드페이 메뉴에 최초로 등록한 리다이렉트 URL이 기본값으로 들어갑니다.

* 브랜드페이 메뉴에 두 개 이상의 리다이렉트 URL을 등록한 상점은 각 도메인에 맞는 redirectUrl 값을 필수로 추가하세요.

응답
아래 메서드를 호출할 수 있는 브랜드페이 객체를 반환합니다.

TossPaymentsBrandpay
requestPayment function
브랜드페이 결제창을 띄웁니다. 자세히 >

changePassword function
브랜드페이 결제 비밀번호를 변경하는 창을 띄웁니다. 자세히 >

addPaymentMethod function
브랜드페이에 새로운 결제수단을 추가합니다. 자세히 >

openSettings function
브랜드페이 결제 관리 설정창을 띄웁니다. 자세히 >

changeOneTouchPay function
원터치결제 설정을 변경합니다. 자세히 >

isOneTouchPayEnabled function
원터치결제 활성화 여부를 확인합니다. 자세히 >

brandpay.requestPayment()
브랜드페이 결제창을 띄웁니다. 구매자의 최초 결제라면 결제수단을 등록하고, 결제가 요청돼요. 이미 결제수단을 등록한 구매자라면 결제수단을 선택하고 결제 비밀번호를 입력하면 바로 결제가 돼요.

결제위젯의 결제 요청은 Redirect 방식과 Promise 방식을 지원하고 있어요. 결제 요청이 끝나고 결과를 확인하는 방법의 차이인데요. Redirect 방식을 선택하면 파라미터로 설정한 successUrl 또는 failUrl로 결제 요청의 결과를 확인할 수 있어요. Promise 방식을 선택하면 Promise로 돌아오는 객체로 결과를 확인할 수 있어요. 브랜드페이 결제에서는 모바일, PC 환경에서 Redirect 방식, Promise 방식 둘 다 지원해요.


Redirect 방식

brandpay.requestPayment({
  amount: {
    currency: 'KRW',
    value: 50000,
  },
  orderId: "FmHKNdkdpotbnUeIkC40a",
  orderName: '토스 티셔츠 외 2건',
  successUrl: window.location.origin + '/success.html',
  failUrl: window.location.origin + '/fail.html',
  customerEmail: 'customer123@gmail.com',
  customerName: '김토스',
});
파라미터
paymentRequest 필수 · object
결제 요청 정보입니다.

amount 필수 · object
결제 금액 정보입니다.

currency 필수 · "KRW"
결제 통화입니다. 브랜드페이는 KRW 결제만 지원합니다.

value 필수 · number
결제 금액입니다.

orderId 필수 · string
주문번호입니다. 각 주문을 구분하는 무작위한 고유값을 생성하세요. 영문 대소문자, 숫자, 특수문자 -, _, =로 이루어진 6자 이상 64자 이하의 문자열이어야 합니다.

orderName 필수 · string
구매상품입니다. 예를 들면 생수 외 1건 같은 형식입니다. 최대 길이는 100자입니다.

customerEmail string
구매자 이메일입니다. 결제 상태가 바뀌면 이메일 주소로 결제내역이 전송됩니다. 최대 길이는 100자입니다.

customerName string
구매자명입니다. 최대 길이는 100자입니다.

taxFreeAmount number
결제 금액 중 면세 금액입니다. 면세 상점 혹은 복합 과세 상점으로 계약된 상점만 사용하세요. 자세한 내용은 세금 처리 가이드에서 확인하세요.

methodId string
결제수단의 ID입니다. 결제수단 ID 입니다. 등록되어 있는 결제수단 중 하나를 지정해서 바로 결제하고 싶을 때 사용합니다.

metadata object
결제 관련 정보를 추가할 수 있는 객체입니다. 최대 5개의 키-값(key-value) 쌍을 자유롭게 추가해주세요. 키는 [ , ] 를 사용하지 않는 최대 40자의 문자열, 값은 최대 500자의 문자열입니다.

successUrl string
결제 요청이 성공하면 리다이렉트되는 URL입니다. https://www.example.com/success와 같이 오리진을 포함한 형태로 설정해주세요. 리다이렉트되면 URL의 쿼리 파라미터로 amount, orderId, paymentKey가 추가돼요.

failUrl string
결제 요청이 실패하면 리다이렉트되는 URL입니다. https://www.example.com/fail와 같이 오리진을 포함한 형태로 설정해주세요. 리다이렉트되면 URL의 쿼리 파라미터로 에러 코드와 메시지를 확인할 수 있어요.

응답
결제 요청이 성공하면 파라미터로 설정한 successUrl로 이동해요. 쿼리 파라미터의 amount 값이 메서드 파라미터로 설정한 amount와 같은지 반드시 확인하고 브랜드페이 결제 승인 API를 호출해서 결제를 완료하세요.

{successUrl}?amount={AMOUNT}&orderId={ORDER_ID}&paymentKey={PAYMENT_KEY}
결제 요청이 실패하면 파라미터로 설정한 failUrl로 이동해요. 쿼리 파라미터로 에러 코드와 메시지를 확인하세요.

{failUrl}?code={ERROR_CODE}&message={ERROR_MESSAGE}&orderId={ORDER_ID}
Redirect 방식에서는 URL이 이동하기 때문에 void가 응답됩니다.

Promise<void>
brandpay.addPaymentMethod()
브랜드페이에 새로운 결제수단을 추가합니다. 카드 또는 계좌를 추가할 수 있어요.

brandpay.addPaymentMethod();
응답
Promise<void>
brandpay.openSettings()
브랜드페이 결제 관리 설정창을 띄웁니다. 결제수단 관리, 비밀번호 설정, 원터치결제 설정, 탈퇴 등 다양한 설정을 구매자가 직접 변경할 수 있어요.

brandpay.openSettings();
응답
Promise<void>
brandpay.changePassword()
브랜드페이 결제 비밀번호를 변경하는 창을 띄웁니다. 기존 비밀번호를 입력하고 새로운 비밀번호를 등록할 수 있어요.

brandpay.changePassword();
응답
Promise<void>
brandpay.changeOneTouchPay()
원터치결제 설정을 변경합니다. 원터치결제는 브랜드페이의 자체 FDS로 안전하다고 판단되는 결제는 비밀번호 입력 없이 편리하게 결제를 완료할 수 있는 기능입니다.

brandpay.changeOneTouchPay();
응답
Promise<void>
brandpay.isOneTouchPayEnabled()
원터치결제 활성화 여부를 확인합니다.

const result = await brandpay.isOneTouchPayEnabled();
alert(result);
응답
Promise<{ isEnabled: boolean; }>
isEnabled boolean
원터치결제 활성화 여부입니다. 원터치결제가 설정되어 있다면 true, 설정되어 있지 않으면 false입니다.

결제창
tossPayments.payment()
결제창을 초기화합니다. 토스페이먼츠에서 제공하는 신용/체크카드 통합결제창을 연동하거나 사용하고 싶은 결제수단의 결제창을 각각 연동할 수 있어요.

const payment = tossPayments.payment({ customerKey });
파라미터
params 필수 · object
결제창 초기화 정보입니다.

customerKey 필수 · string
구매자를 식별하는 고유 아이디입니다.

이메일・전화번호나 자동 증가하는 숫자와 같이 유추가 가능한 값은 안전하지 않아요. UUID와 같이 충분히 무작위적인 고유 값으로 생성해주세요. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 중 최소 1개를 포함하는 최소 2자 이상 최대 50자 이하의 문자열이어야 합니다.

응답
아래 메서드를 호출할 수 있는 결제창 객체를 반환합니다.

TossPaymentsPayment
requestPayment function
결제창을 띄웁니다. 자세히 >

requestBillingAuth function
자동결제(빌링) 카드 등록창을 띄웁니다. 자세히 >

payment.requestPayment()
결제창을 띄웁니다.

결제창 결제 요청은 Redirect 방식과 Promise 방식을 지원하고 있어요. 결제 요청이 끝나고 결과를 확인하는 방법의 차이인데요. Redirect 방식을 선택하면 파라미터로 설정한 successUrl 또는 failUrl로 결제 요청의 결과를 확인할 수 있어요. Promise 방식을 선택하면 Promise로 돌아오는 객체로 결과를 확인할 수 있지만, Promise 방식은 모바일 환경에서 사용할 수 없어요.


카드(Redirect 방식)

payment.requestPayment({
  method: "CARD",
  amount: {
    currency: "KRW",
    value: 50000,
  },
  orderId: "FX_79wwbatkf6fMI3p6pT",
  orderName: "토스 티셔츠 외 2건",
  successUrl: window.location.origin + "/success.html",
  failUrl: window.location.origin + "/fail.html",
  customerEmail: "customer123@gmail.com",
  customerName: "김토스",
  card: {
    useEscrow: false,
    flowMode: "DEFAULT",
    useCardPoint: false,
    useAppCardOnly: false,
  },
})
파라미터
paymentRequest 필수 · object
결제 요청 정보입니다.

method 필수 · "CARD"
결제수단입니다. CARD로 설정하면 카드/간편결제 통합결제창, 카드・간편결제 자체창을 사용할 수 있어요.

card object
카드 결제 정보입니다.

useEscrow boolean
에스크로 적용 여부입니다. true로 설정하면 구매자가 반드시 에스크로 적용에 동의해야 결제가 완료돼요. false로 설정하거나 파라미터를 설정하지 않으면 에스크로 적용을 구매자 선택에 맡겨요.

taxExemptionAmount number
과세를 제외한 결제 금액(컵 보증금 등)입니다. 과세 제외 금액이 있는 카드 결제는 부분 취소가 안 됩니다.

flowMode enum
결제창을 여는 방법입니다. DEFAULT는 카드/간편결제 통합결제창을 열고, DIRECT는 카드 또는 간편결제의 자체창을 열어요. 기본 값은 DEFAULT입니다.

cardCompany string
카드사 코드입니다. flowMode 값에 따라 아래와 같이 다르게 동작해요. flowMode가 DIRECT일 때는 입력한 코드의 카드사 앱이 열려요. flowMode가 DEFAULT일 때는 통합결제창에 입력한 코드의 카드사만 보여요.

easyPay string
간편결제 코드입니다. flowMode 값에 따라 아래와 같이 다르게 동작해요. flowMode가 DIRECT일 때는 입력한 코드의 간편결제 앱이 열려요. flowMode가 DEFAULT일 때는 해당 파라미터와 상관 없이 기본 통합결제창이 열려요.

cardInstallmentPlan number
신용카드 결제에 적용되는 할부 개월 수입니다. 예를 들어, 6으로 설정하면 할부 개월 수가 6개월로 고정돼요. 자체창에서는 구매자가 할부 개월 수를 볼 수 없으니 사전에 충분히 안내를 해주세요. 0(일시불), 2~12 값으로 설정할 수 있고 maxCardInstallmentPlan 파라미터와 함께 사용할 수 없어요. 카드사 별로 할부결제가 가능한 최소 금액을 확인하세요.

maxCardInstallmentPlan number
신용카드 결제에 적용할 수 있는 최대 할부 개월 수입니다. 예를 들어, 6으로 설정하면 구매자는 일시불부터 6개월 할부를 선택할 수 있어요. 0(일시불), 2~12 값으로 설정할 수 있고 cardInstallmentPlan 파라미터와 함께 사용할 수 없어요. 카드사 별로 할부결제가 가능한 최소 금액을 확인하세요.

freeInstallmentPlans array
신용카드 결제에 적용할 수 있는 상점 부담 무이자 할부 정보입니다. 구매자가 선택한 카드, 할부 개월 수가 배열에 등록한 정보와 같다면 무이자가 할부가 자동으로 적용돼요. 카드사 별로 할부결제가 가능한 최소 금액을 확인하세요.

company 필수 · string
상점 부담 무이자를 적용할 카드사 코드입니다.

months 필수 · array
상점 부담 무이자를 적용할 할부 개월입니다.

useCardPoint boolean
카드사 포인트 사용 여부입니다. true로 설정하면 카드사 포인트 사용이 체크된 상태로 결제창이 열려요. false로 설정하거나 값을 넣지 않으면 구매자가 직접 카드사 포인트 사용 여부를 선택할 수 있어요.

* 추가 계약이 필요한 파라미터입니다. 토스페이먼츠 고객센터(1544-7772, support@tosspayments.com)로 문의해주세요.

useAppCardOnly boolean
앱카드 단독 사용 여부입니다. true로 설정하면 카드사의 앱카드만 열려요. 국민, 농협, 롯데, 삼성, 신한, 우리, 현대 카드 결제에 적용할 수 있어요.

discountCode string
카드사의 프로모션 코드입니다. 프로모션은 flowMode가 DIRECT로 설정된 자체창 결제에만 사용할 수 있어요. 프로모션 조회 API로 적용할 수 있는 프로모션 코드를 확인하세요.

validHours number
시간으로 설정하는 결제 기한입니다. 설정할 수 있는 최대 값은 2160시간(90일)입니다. 기한이 지나고 시도하는 결제는 실패해요. 예를 들어 24로 설정하면, 결제 요청 시점으로부터 24시간 동안 결제할 수 있어요.

dueDate string
특정 날짜로 설정하는 결제 기한입니다. yyyy-MM-dd'T'HH:mm:ss ISO 8601 형식입니다. 기한이 지나고 시도하는 결제는 실패해요. 예를 들어 2025-01-01T00:00:00으로 설정하면, 2024년 12월 31일 23:59까지 결제할 수 있어요.

escrowProducts array
id string
각 상품의 고유 ID입니다.

name string
상품명입니다.

code string
내 상점에서 사용하는 상품 관리 코드입니다.

unitPrice number
상품의 1개의 개별 가격입니다.

quantity number
상품 구매 수량입니다.

useInternationalCardOnly boolean
해외카드(Visa, MasterCard, JCB, UnionPay 등) 결제 여부입니다. true로 설정하면 해외카드 결제가 가능한 다국어 결제창이 열립니다.

appScheme string
페이북/ISP 앱에서 상점 앱으로 돌아올 때 사용됩니다. 상점의 앱 스킴을 지정하면 됩니다. 예를 들면 testapp://같은 형태입니다.

amount 필수 · object
결제 금액 정보입니다.

value 필수 · number
결제 금액입니다.

currency 필수 · string
결제 통화입니다. 일반결제는 KRW만 지원합니다. 해외 간편결제(PayPal)는 USD만 지원합니다.

orderName 필수 · string
구매상품입니다. 예를 들면 생수 외 1건 같은 형식입니다. 최대 길이는 100자입니다.

orderId 필수 · string
주문번호입니다. 각 주문을 구분하는 무작위한 고유값을 생성하세요. 영문 대소문자, 숫자, 특수문자 -, _, =로 이루어진 6자 이상 64자 이하의 문자열이어야 합니다.

customerName string
구매자명입니다. 최대 길이는 100자입니다.

customerEmail string
구매자 이메일입니다. 결제 상태가 바뀌면 이메일 주소로 결제내역이 전송됩니다. 최대 길이는 100자입니다.

customerMobilePhone string
구매자의 휴대폰 번호입니다. 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되고 있어요. - 없이 숫자로만 구성된 최소 8자, 최대 15자의 문자열입니다.

taxFreeAmount number
결제 금액 중 면세 금액입니다. 면세 상점 혹은 복합 과세 상점으로 계약된 상점만 사용하세요. 자세한 내용은 세금 처리 가이드에서 확인하세요.

windowTarget enum
브라우저에서 결제창이 열리는 프레임입니다. self, iframe 중 하나입니다.

- self는 현재 브라우저를 결제창으로 이동시켜요. 모바일 환경에서 기본 값입니다.

- iframe은 iframe에서 결제창이 열려요. PC 환경에서 기본 값입니다. 모바일 환경에서는 iframe을 사용할 수 없습니다.

metadata object
결제 관련 정보를 추가할 수 있는 객체입니다. 최대 5개의 키-값(key-value) 쌍을 자유롭게 추가해주세요. 키는 [ , ] 를 사용하지 않는 최대 40자의 문자열, 값은 최대 500자의 문자열입니다.

successUrl string
결제 요청이 성공하면 리다이렉트되는 URL입니다. https://www.example.com/success와 같이 오리진을 포함한 형태로 설정해주세요. 리다이렉트되면 URL의 쿼리 파라미터로 amount, orderId, paymentKey가 추가돼요.

failUrl string
결제 요청이 실패하면 리다이렉트되는 URL입니다. https://www.example.com/fail와 같이 오리진을 포함한 형태로 설정해주세요. 리다이렉트되면 URL의 쿼리 파라미터로 에러 코드와 메시지를 확인할 수 있어요.

응답
결제 요청이 성공하면 파라미터로 설정한 successUrl로 이동해요. 쿼리 파라미터의 amount 값이 메서드 파라미터로 설정한 amount와 같은지 반드시 확인하고 결제 승인 API를 호출해서 결제를 완료하세요.

{successUrl}?amount={AMOUNT}&orderId={ORDER_ID}&paymentKey={PAYMENT_KEY}
결제 요청이 실패하면 파라미터로 설정한 failUrl로 이동해요. 쿼리 파라미터로 에러 코드와 메시지를 확인하세요.

{failUrl}?code={ERROR_CODE}&message={ERROR_MESSAGE}&orderId={ORDER_ID}
Redirect 방식에서는 URL이 이동하기 때문에 void가 응답됩니다.

Promise<void>
payment.requestBillingAuth()
자동결제(빌링) 카드 등록창을 띄웁니다. 자동결제는 카드만 지원해요. 카드 등록창에서는 구매자가 카드 정보를 입력하고 본인인증을 해요.

payment.requestBillingAuth({
  method: 'CARD',
  successUrl: window.location.origin + '/payment/billing',
  failUrl: window.location.origin + '/fail',
  customerEmail: 'customer123@gmail.com',
  customerName: '김토스',
});
파라미터
billingAuthRequest 필수 · object
자동결제(빌링) 카드 등록에 필요한 정보입니다.

method 필수 · "CARD"
자동결제(빌링)에 등록할 결제수단입니다. 토스페이먼츠 자동결제는 현재 신용·체크카드만 지원해요.

successUrl 필수 · string
카드 등록이 성공하면 리다이렉트되는 URL입니다. 리다이렉트되면 URL의 쿼리 파라미터로 authKey, customerKey가 추가돼요. 값을 검증하고 빌링키 발급 API를 호출하세요. 반드시 오리진을 포함해야 합니다.

failUrl 필수 · string
카드 등록이 실패하면 리다이렉트되는 URL입니다. 리다이렉트되면 URL의 쿼리 파라미터로 에러 코드와 메시지를 확인할 수 있어요. 반드시 오리진을 포함해야 합니다.

customerName string
구매자명입니다. 상점관리자 및 결제내역 이메일에 사용됩니다. 최대 길이는 100자입니다.

customerEmail string
구매자의 이메일 주소입니다. 결제 상태가 바뀌면 이메일 주소로 결제내역이 전송됩니다. 최대 길이는 100자입니다.

windowTarget enum
브라우저에서 결제창이 열리는 프레임입니다. self, iframe 중 하나입니다.

- self는 현재 브라우저를 결제창으로 이동시켜요. 모바일 환경에서 기본 값입니다.

- iframe은 iframe에서 결제창이 열려요. PC 환경에서 기본 값입니다. 모바일 환경에서는 iframe을 사용할 수 없습니다.

응답
URL이 이동하기 때문에 void가 응답됩니다. 파라미터로 설정한 successUrl 또는 failUrl에서 카드 등록 결과를 확인하고 빌링키 발급 API를 호출해야 자동결제를 할 수 있어요.
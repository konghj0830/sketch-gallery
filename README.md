# Sketch Gallery

PRD 문서에 따라 구현된 클라이언트 사이드 스케치 갤러리 애플리케이션입니다.

## 기능

- ✅ 스케치 업로드 (제목, 설명, 태그, 이미지)
- ✅ 스케치 조회 (그리드 레이아웃)
- ✅ 스케치 편집 및 삭제
- ✅ 좋아요 기능
- ✅ 댓글 시스템
- ✅ 태그별 필터링
- ✅ 정렬 기능 (최신순, 좋아요순, 제목순)
- ✅ 토스트 알림
- ✅ 반응형 디자인
- ✅ LocalStorage 데이터 저장

## 사용법

1. `index.html` 파일을 웹 브라우저에서 열기
2. "새 스케치" 버튼을 클릭하여 이미지 업로드
3. 갤러리에서 스케치 클릭하여 상세보기
4. 필터와 정렬 옵션 사용

## 기술 스택

- HTML5
- CSS3 (Flexbox, Grid, 애니메이션)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- FileReader API (Base64 인코딩)

## 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

모든 데이터는 브라우저의 LocalStorage에 저장되므로 완전히 오프라인에서 작동합니다.

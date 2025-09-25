// 참가자 수 입력
let number = Number(prompt('참가자는 몇 명인가요? (2명 이상)'));

// [수정] isNaN(number) 조건을 추가하여 문자가 입력됐는지 확인
while (isNaN(number) || number < 2) {
    alert('2명 이상의 숫자를 정확히 입력해주세요.');
    number = Number(prompt('참가자는 몇 명인가요? (2명 이상)'));
}

const participants = [];

// 참가자 이름 입력받는 로직 (중복 방지 기능 추가)
for (let i = 0; i < number; i++) {
    let name;
    // 유효한 이름이 입력될 때까지 무한 반복
    while (true) {
        name = prompt(`${i + 1}번째 참가자의 이름을 입력하세요.`);

        // 이름이 비어있거나 공백만 있는지 확인
        if (!name || !name.trim()) {
            alert('이름을 반드시 입력해야 합니다.');
            continue; // 다시 이름 입력받기
        }

        // 중복된 이름이 있는지 확인
        if (participants.includes(name.trim())) {
            alert('이미 사용 중인 이름입니다. 다른 이름을 입력해주세요.');
            continue; // 다시 이름 입력받기
        }

        // 문제가 없으면 반복문 탈출
        break;
    }
    // 좌우 공백을 제거한 이름을 배열에 추가
    participants.push(name.trim());
}

alert(`참가자: ${participants.join(', ')}. 게임을 시작합니다!`);

// 해당 영역 가져오기
const input = document.querySelector('input');
const button = document.querySelector('button');
const wordEl = document.querySelector('#word');
const orderEl = document.querySelector('#order');

// 제시어와 입력 단어 저장
let newWord;
let word;
const usedWords = []; // 사용된 단어를 저장할 배열 추가
let turn = 1; // 현재 순서 (숫자)

// 초기 순서(첫 번째 참가자 이름) 표시
orderEl.textContent = participants[0];

// 입력 단어 가져오기
const onInput = function (event) {
    newWord = event.target.value;
};

// 버튼 클릭 시 단어가 맞는지 확인하기
const onClickButton = (event) => {
    event.preventDefault();; // form의 기본 동작(새로고침) 방지

    // 1. 입력값이 없는지 먼저 확인
    if (!newWord) {
        alert('단어를 입력해주세요.');
        return; // 알림 후 함수를 종료하여 더 이상 진행되지 않도록 함
    }

    // 성공 조건: (1)두 글자 이상이고, (2)끝말이 이어지고, (3)사용한 적 없는 단어
    const isWordValid = newWord.length > 1;
    const isWordChainCorrect = !word || word.at(-1) === newWord[0];
    const isWordNew = !usedWords.includes(newWord);

    // 2. 단어가 유효하고 중복되지 않았는지 확인
    if (isWordValid && isWordChainCorrect && isWordNew) {
        word = newWord;
        wordEl.textContent = word;
        usedWords.push(word); // 3. 사용한 단어 배열에 추가

        // 다음 순서로 넘기기 (현재 참가자 수에 맞춰 순환)
        turn = (turn % participants.length) + 1;
        orderEl.textContent = participants[turn - 1];
    }
    else {
        // 4. 중복 단어일 경우 경고 메시지 표시
        // 실패 사유 알림
        let alertMessage;
        if (!isWordValid) {
            alertMessage = '한 글자 단어은(는) 사용할 수 없습니다.';
        } else if (!isWordNew) {
            alertMessage = `'${newWord}'은(는) 이미 사용된 단어입니다.`;
        } else { // !isWordChainCorrect
            alertMessage = `'${newWord}'은(는) 잘못된 단어입니다.`;
        }
        alert(alertMessage);

        const eliminatedPlayer = participants[turn - 1];
        alert(`💥 ${eliminatedPlayer}(이)가 탈락했습니다!`);

        // 참가자 배열에서 현재 순서의 참가자 제거
        participants.splice(turn - 1, 1);

        // [승리 조건] 남은 참가자가 1명인 경우
        if (participants.length === 1) {
            const winner = participants[0];
            alert(`🎉 최종 우승자는 ${winner}님입니다! 축하합니다!`);
            wordEl.textContent = '게임 종료';
            orderEl.textContent = winner;
            input.disabled = true; // 입력창 비활성화
            button.disabled = true; // 버튼 비활성화
            return;
        }

        // 탈락자가 마지막 순서였을 경우, 턴을 1번으로 조정
        if (turn > participants.length) {
            turn = 1;
        }

        // 화면에 다음 차례 참가자 이름 표시
        orderEl.textContent = participants[turn - 1];
    }
    input.value = '';
    input.focus();
};

// 엔터 키 이벤트 추가 
const onEnterKey = (event) => {
    if (event.key === 'Enter') {
        onClickButton(event);
    }
};

input.addEventListener('keydown', onEnterKey);
input.addEventListener('input', onInput);
button.addEventListener('click', onClickButton);
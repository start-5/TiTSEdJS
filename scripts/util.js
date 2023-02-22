/* eslint-disable no-unused-vars */

const util = {

    /**
    * Append an 'if' bound element to its parent container
    * @param {string} expression
    * @param {HTMLElement} parent
    * @param {HTMLElement} element
    */
    appendKoIfBlock(parent, element, expression) {

        const bindingCommentStart = document.createComment(`ko if: ${expression}`);
        const bindingCommentEnd = document.createComment('/ko');

        parent.appendChild(bindingCommentStart);
        parent.appendChild(element);
        parent.appendChild(bindingCommentEnd);

    },

    /**
    * Get cup size display
    * @param {number} rating
    */
    getCupSize: function (rating) {
        if (rating < 1) return 'flat';
        else if (rating < 2) return 'A-cup';
        else if (rating < 3) return 'B-cup';
        else if (rating < 4) return 'C-cup';
        else if (rating < 5) return 'D-cup';
        else if (rating < 6) return 'DD-cup';
        else if (rating < 7) return 'big DD-cup';
        else if (rating < 8) return 'E-cup';
        else if (rating < 9) return 'big E-cup';
        else if (rating < 10) return 'EE-cup';
        else if (rating < 11) return 'big EE-cup';
        else if (rating < 12) return 'F-cup';
        else if (rating < 13) return 'big F-cup';
        else if (rating < 14) return 'FF-cup';
        else if (rating < 15) return 'big FF-cup';
        else if (rating < 16) return 'G-cup';
        else if (rating < 17) return 'big G-cup';
        else if (rating < 18) return 'GG-cup';
        else if (rating < 19) return 'big GG-cup';
        else if (rating < 20) return 'H-cup';
        else if (rating < 21) return 'big H-cup';
        else if (rating < 22) return 'HH-cup';
        else if (rating < 23) return 'big HH-cup';
        else if (rating < 24) return 'HHH-cup';
        else if (rating < 25) return 'I-cup';
        else if (rating < 26) return 'big I-cup';
        else if (rating < 27) return 'II-cup';
        else if (rating < 28) return 'big II-cup';
        else if (rating < 29) return 'J-cup';
        else if (rating < 30) return 'big J-cup';
        else if (rating < 31) return 'JJ-cup';
        else if (rating < 32) return 'big JJ-cup';
        else if (rating < 33) return 'K-cup';
        else if (rating < 34) return 'big K-cup';
        else if (rating < 35) return 'KK-cup';
        else if (rating < 36) return 'big KK-cup';
        else if (rating < 37) return 'L-cup';
        else if (rating < 38) return 'big L-cup';
        else if (rating < 39) return 'LL-cup';
        else if (rating < 40) return 'big LL-cup';
        else if (rating < 41) return 'M-cup';
        else if (rating < 42) return 'big M-cup';
        else if (rating < 43) return 'MM-cup';
        else if (rating < 44) return 'big MM-cup';
        else if (rating < 45) return 'MMM-cup';
        else if (rating < 46) return 'large MMM-cup';
        else if (rating < 47) return 'N-cup';
        else if (rating < 48) return 'large N-cup';
        else if (rating < 49) return 'NN-cup';
        else if (rating < 50) return 'large NN-cup';
        else if (rating < 51) return 'O-cup';
        else if (rating < 52) return 'large O-cup';
        else if (rating < 53) return 'OO-cup';
        else if (rating < 54) return 'large OO-cup';
        else if (rating < 55) return 'P-cup';
        else if (rating < 56) return 'large P-cup';
        else if (rating < 57) return 'PP-cup';
        else if (rating < 58) return 'large PP-cup';
        else if (rating < 59) return 'Q-cup';
        else if (rating < 60) return 'large Q-cup';
        else if (rating < 61) return 'QQ-cup';
        else if (rating < 62) return 'large QQ-cup';
        else if (rating < 63) return 'R-cup';
        else if (rating < 64) return 'large R-cup';
        else if (rating < 65) return 'RR-cup';
        else if (rating < 66) return 'large RR-cup';
        else if (rating < 67) return 'S-cup';
        else if (rating < 68) return 'large S-cup';
        else if (rating < 69) return 'SS-cup';
        else if (rating < 70) return 'large SS-cup';
        else if (rating < 71) return 'T-cup';
        else if (rating < 72) return 'large T-cup';
        else if (rating < 73) return 'TT-cup';
        else if (rating < 74) return 'large TT-cup';
        else if (rating < 75) return 'U-cup';
        else if (rating < 76) return 'large U-cup';
        else if (rating < 77) return 'UU-cup';
        else if (rating < 78) return 'large UU-cup';
        else if (rating < 79) return 'V-cup';
        else if (rating < 80) return 'large V-cup';
        else if (rating < 81) return 'VV-cup';
        else if (rating < 82) return 'large VV-cup';
        else if (rating < 83) return 'W-cup';
        else if (rating < 84) return 'large W-cup';
        else if (rating < 85) return 'WW-cup';
        else if (rating < 86) return 'large WW-cup';
        else if (rating < 87) return 'X-cup';
        else if (rating < 88) return 'large X-cup';
        else if (rating < 89) return 'XX-cup';
        else if (rating < 90) return 'large XX-cup';
        else if (rating < 91) return 'Y-cup';
        else if (rating < 92) return 'large Y-cup';
        else if (rating < 93) return 'YY-cup';
        else if (rating < 94) return 'large YY-cup';
        else if (rating < 95) return 'Z-cup';
        else if (rating < 96) return 'large Z-cup';
        else if (rating < 97) return 'ZZ-cup';
        else if (rating < 98) return 'large ZZ-cup';
        else if (rating < 99) return 'ZZZ-cup';
        else if (rating < 100) return 'large ZZZ-cup';
        else if (rating < 101) return 'hyper A-cup';
        else if (rating < 102) return 'hyper B-cup';
        else if (rating < 103) return 'hyper C-cup';
        else if (rating < 104) return 'hyper D-cup';
        else if (rating < 105) return 'hyper DD-cup';
        else if (rating < 106) return 'hyper big DD-cup';
        else if (rating < 107) return 'hyper E-cup';
        else if (rating < 108) return 'hyper big E-cup';
        else if (rating < 109) return 'hyper EE-cup';
        else if (rating < 110) return 'hyper big EE-cup';
        else if (rating < 111) return 'hyper F-cup';
        else if (rating < 112) return 'hyper big F-cup';
        else if (rating < 113) return 'hyper FF-cup';
        else if (rating < 114) return 'hyper big FF-cup';
        else if (rating < 115) return 'hyper G-cup';
        else if (rating < 116) return 'hyper big G-cup';
        else if (rating < 117) return 'hyper GG-cup';
        else if (rating < 118) return 'hyper big GG-cup';
        else if (rating < 119) return 'hyper H-cup';
        else if (rating < 120) return 'hyper big H-cup';
        else if (rating < 121) return 'hyper HH-cup';
        else if (rating < 122) return 'hyper big HH-cup';
        else if (rating < 123) return 'hyper HHH-cup';
        else if (rating < 124) return 'hyper I-cup';
        else if (rating < 125) return 'hyper big I-cup';
        else if (rating < 126) return 'hyper II-cup';
        else if (rating < 127) return 'hyper big II-cup';
        else if (rating < 128) return 'hyper J-cup';
        else if (rating < 129) return 'hyper big J-cup';
        else if (rating < 130) return 'hyper JJ-cup';
        else if (rating < 131) return 'hyper big JJ-cup';
        else if (rating < 132) return 'hyper K-cup';
        else if (rating < 133) return 'hyper big K-cup';
        else if (rating < 134) return 'hyper KK-cup';
        else if (rating < 135) return 'hyper big KK-cup';
        else if (rating < 136) return 'hyper L-cup';
        else if (rating < 137) return 'hyper big L-cup';
        else if (rating < 138) return 'hyper LL-cup';
        else if (rating < 139) return 'hyper big LL-cup';
        else if (rating < 140) return 'hyper M-cup';
        else if (rating < 141) return 'hyper big M-cup';
        else if (rating < 142) return 'hyper MM-cup';
        else if (rating < 143) return 'hyper big MM-cup';
        else if (rating < 144) return 'hyper MMM-cup';
        else if (rating < 145) return 'hyper large MMM-cup';
        else if (rating < 146) return 'hyper N-cup';
        else if (rating < 147) return 'hyper large N-cup';
        else if (rating < 148) return 'hyper NN-cup';
        else if (rating < 149) return 'hyper large NN-cup';
        else if (rating < 150) return 'hyper O-cup';
        else if (rating < 151) return 'hyper large O-cup';
        else if (rating < 152) return 'hyper OO-cup';
        else if (rating < 153) return 'hyper large OO-cup';
        else if (rating < 154) return 'hyper P-cup';
        else if (rating < 155) return 'hyper large P-cup';
        else if (rating < 156) return 'hyper PP-cup';
        else if (rating < 157) return 'hyper large PP-cup';
        else if (rating < 158) return 'hyper Q-cup';
        else if (rating < 159) return 'hyper large Q-cup';
        else if (rating < 160) return 'hyper QQ-cup';
        else if (rating < 161) return 'hyper large QQ-cup';
        else if (rating < 162) return 'hyper R-cup';
        else if (rating < 163) return 'hyper large R-cup';
        else if (rating < 164) return 'hyper RR-cup';
        else if (rating < 165) return 'hyper large RR-cup';
        else if (rating < 166) return 'hyper S-cup';
        else if (rating < 167) return 'hyper large S-cup';
        else if (rating < 168) return 'hyper SS-cup';
        else if (rating < 169) return 'hyper large SS-cup';
        else if (rating < 170) return 'hyper T-cup';
        else if (rating < 171) return 'hyper large T-cup';
        else if (rating < 172) return 'hyper TT-cup';
        else if (rating < 173) return 'hyper large TT-cup';
        else if (rating < 174) return 'hyper U-cup';
        else if (rating < 175) return 'hyper large U-cup';
        else if (rating < 176) return 'hyper UU-cup';
        else if (rating < 177) return 'hyper large UU-cup';
        else if (rating < 178) return 'hyper V-cup';
        else if (rating < 179) return 'hyper large V-cup';
        else if (rating < 180) return 'hyper VV-cup';
        else if (rating < 181) return 'hyper large VV-cup';
        else if (rating < 182) return 'hyper W-cup';
        else if (rating < 183) return 'hyper large W-cup';
        else if (rating < 184) return 'hyper WW-cup';
        else if (rating < 185) return 'hyper large WW-cup';
        else if (rating < 186) return 'hyper X-cup';
        else if (rating < 187) return 'hyper large X-cup';
        else if (rating < 188) return 'hyper XX-cup';
        else if (rating < 189) return 'hyper large XX-cup';
        else if (rating < 190) return 'hyper Y-cup';
        else if (rating < 191) return 'hyper large Y-cup';
        else if (rating < 192) return 'hyper YY-cup';
        else if (rating < 193) return 'hyper large YY-cup';
        else if (rating < 194) return 'hyper Z-cup';
        else if (rating < 195) return 'hyper large Z-cup';
        else if (rating < 196) return 'hyper ZZ-cup';
        else if (rating < 197) return 'hyper large ZZ-cup';
        else if (rating < 198) return 'hyper ZZZ-cup';
        else if (rating < 199) return 'hyper large ZZZ-cup';
        else if (rating >= 199) return 'Jacques00-cup';
    }

};
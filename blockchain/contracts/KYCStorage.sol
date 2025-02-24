// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract KYCStorage {
    struct KYCRecord {
        string walletAddress;
        string status;        // Adicionado status
        string cpf;
        string base64Image;
        bool vivacity;
        string probability;
        string similarity;
        string validationTime;
    }

    mapping(string => KYCRecord) private kycRecords;

    event KYCStored(string indexed walletAddress);

    function createKYC(
        string memory _walletAddress,
        string memory _status,    // Adicionado status
        string memory _cpf,
        string memory _base64Image,
        bool _vivacity,
        string memory _probability,
        string memory _similarity,
        string memory _validationTime
    ) public {
        kycRecords[_walletAddress] = KYCRecord({
            walletAddress: _walletAddress,
            status: _status,      // Adicionado status
            cpf: _cpf,
            base64Image: _base64Image,
            vivacity: _vivacity,
            probability: _probability,
            similarity: _similarity,
            validationTime: _validationTime
        });
        emit KYCStored(_walletAddress);
    }
    
    function getKYC(string memory _walletAddress)
        public
        view
        returns (
            string memory,
            string memory,    // Retorno do status
            string memory,
            string memory,
            bool,
            string memory,
            string memory,
            string memory
        )
    {
        KYCRecord memory record = kycRecords[_walletAddress];
        return (
            record.walletAddress,
            record.status,        // Retorno do status
            record.cpf,
            record.base64Image,
            record.vivacity,
            record.probability,
            record.similarity,
            record.validationTime
        );
    }
}

#include<stdio.h>
#include<string.h>

void XOR(char* dividend,char* divisor,int pos){
    for(int i=0;i<strlen(divisor);i++){
        dividend[pos+i] = ( dividend[pos+i]==divisor[i])?'0':'1';
    }
}

void crc(char* data,char* divisor,char* reminder){
    int n = strlen(data);
    int divlen = strlen(divisor);
    char tempData[50];
    strcpy(tempData,data);
    for(int i=0;i<= n-divlen;i++){
                if (tempData[i] == '1') 
{
            XOR(tempData, divisor, i);
}
    }
    strcpy(reminder,tempData+n-divlen+1);
}


int main() 
{
    char data[50], divisor[20], receivedData[50];
    char remainder[20];
    printf("Enter data to be transmitted: ");
    scanf("%s", data);
    printf("Enter the Generating polynomial: ");
    scanf("%s", divisor);
    int k = strlen(data);
    int divisorLen = strlen(divisor);
    for (int i = 0; i < divisorLen - 1; i++) 
{
        data[k + i] = '0';
}
    data[k + divisorLen - 1] = '\0';
    printf("Data padded with n-1 zeros: %s\n", data);
    crc(data, divisor, remainder);
    printf("CRC or Check value is: %s\n", remainder);
    printf("Final data to be sent: %s\n", data);
    printf("Enter the received data: ");
    scanf("%s", receivedData);
    printf("Data received: %s\n", receivedData);
    crc(receivedData, divisor, remainder);
    int error = 0;
    for (int i = 0; i < divisorLen - 1; i++) 
{
        if (remainder[i] != '0') 
{
            error = 1;
            break;
}
}
    if (error) 
{
        printf("Error detected in received data.\n");
} else 
{
        printf("No error detected.\n");
}

    return 0;

}
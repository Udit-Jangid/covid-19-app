#include <iostream>

using namespace std;

int main() {
    for (int i = 2; i <= 37; i++) {
        cout<<"<tr>"<<endl;
        cout<<"    <th class=\"state_cell\">{%State"<<i<<"%}</th>"<<endl;
        cout<<"    <th class=\"c_cell\">{%Confirmed"<<i<<"%}</th>"<<endl;
        cout<<"    <th class=\"a_cell\">{%Active"<<i<<"%}</th>"<<endl;
        cout<<"    <th class=\"r_cell\">{%Recovered"<<i<<"%}</th>"<<endl;
        cout<<"    <th class=\"d_cell\">{%Deaths"<<i<<"%}</th>"<<endl;
        cout<<"    <th class=\"time_cell\">{%Updated On"<<i<<"%}</th>"<<endl;
        cout<<"</tr>"<<endl;
    }
    return 0;
}

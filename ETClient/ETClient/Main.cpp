#include <QApplication>
#include <QLabel>
#include <QtDebug>
#include <QWidget>
#include "Authorization/Headers/AuthPresenter.h"

using namespace ETClient;

int main(int argc, char* argv[])
{
    // for memory leak checking
    _CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);

    QApplication app(argc, argv);

    AuthPresenter authPresenter;
    qDebug() << "Starting program";
    return app.exec();
}



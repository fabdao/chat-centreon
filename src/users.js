import Table from 'cli-table3';
import colors from 'colors';

export class Users
{
    table;

    constructor()
    {
        this.table = new Table(
            {head: ['', 'Status'.cyan, "Last message at".yellow, "Number of messages".magenta]}
        );

        this.table.push(
            { 'Fabrice': ['Online'.green, '2020-02-21 11:42', '3'] },
            { 'Laura': ['Offline'.red, '2020-02-21 11:48', '4'] }
        );
    }

    print()
    {
        console.log(this.table.toString());
    }
}
